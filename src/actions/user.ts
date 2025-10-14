"use server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./auth";
import { tryCatch } from "@/lib/try-catch";
import { revalidatePath } from "next/cache";
import { uploadFiles } from "@/lib/file-uploads";
import { updateUserProfileSchema } from "@/lib/validation-schemas";

export async function getUserTeamPageData() {
  const { data: user, error: getCurrentUserError } = await tryCatch(
    getCurrentUser()
  );

  if (getCurrentUserError || !user) {
    return { data: null, error: "Unauthorized" };
  }

  const { data: userTeams, error: userTeamsError } = await tryCatch(
    prisma.team.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        members: {
          where: {
            userId: user.id,
          },
        },
      },
    })
  );

  if (userTeamsError) {
    return { data: null, error: "Failed to load teams" };
  }

  let currentSessionTeam = null;
  let currentSessionTeamError = null;
  if (user.currentSessionTeamId) {
    const currentSessionTeamResult = await tryCatch(
      prisma.team.findUnique({
        where: { id: user.currentSessionTeamId },
        include: {
          members: {
            where: {
              userId: user.id,
            },
            include: {
              availability: true,
              blockOffs: {
                where: {
                  end: {
                    gt: new Date(),
                  },
                },
                orderBy: {
                  start: "asc",
                },
              },
              services: true,
            },
          },
        },
      })
    );
    currentSessionTeam = currentSessionTeamResult.data;
    currentSessionTeamError = currentSessionTeamResult.error;
  }

  if (currentSessionTeamError) {
    return { data: null, error: "Failed to load current session team" };
  }

  const { data: invites, error: invitesError } = await tryCatch(
    prisma.invite.findMany({
      where: {
        email: user.email,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        team: true,
      },
    })
  );

  if (invitesError) {
    return { data: null, error: "Failed to load invites" };
  }

  return {
    data: {
      teams: userTeams,
      currentSessionTeam,
      invites,
    },
    error: null,
  };
}

export async function updateUserCurrentSessionTeam(teamId: string) {
  const { data: user, error: getCurrentUserError } = await tryCatch(
    getCurrentUser()
  );

  if (getCurrentUserError || !user) {
    return { data: null, error: "Unauthorized" };
  }

  // Verify that the user is a member of the team
  const { data: teamMembership, error: membershipError } = await tryCatch(
    prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: user.id,
      },
    })
  );

  if (membershipError) {
    return { data: null, error: "Failed to verify team membership" };
  }

  if (!teamMembership) {
    return { data: null, error: "You are not a member of this team" };
  }

  const { data: updatedUser, error: updateUserError } = await tryCatch(
    prisma.user.update({
      where: { id: user.id },
      data: { currentSessionTeamId: teamId },
    })
  );

  if (updateUserError) {
    return { data: null, error: "Failed to update current session team" };
  }

  await revalidatePath("/team");

  return { data: updatedUser, error: null };
}

export async function acceptInvite(inviteId: string) {
  const { data: user, error: getCurrentUserError } = await tryCatch(
    getCurrentUser()
  );
  if (getCurrentUserError || !user) {
    return { data: null, error: "Unauthorized" };
  }

  // Get the invite and check if it's expired
  const { data: invite, error: inviteError } = await tryCatch(
    prisma.invite.findUnique({
      where: { id: inviteId },
      include: { team: true },
    })
  );

  if (inviteError || !invite) {
    return { data: null, error: "Invite not found" };
  }

  if (new Date(invite.expiresAt) < new Date()) {
    return { data: null, error: "Invite has expired" };
  }

  // Check if user is already a member of the team
  const { data: existingMember, error: memberError } = await tryCatch(
    prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: user.id,
          teamId: invite.teamId,
        },
      },
    })
  );

  if (memberError) {
    return { data: null, error: "Failed to check team membership" };
  }

  if (existingMember) {
    return { data: null, error: "You are already a member of this team" };
  }

  // Create team member and update current session team
  const { data: teamMember, error: createError } = await tryCatch(
    prisma.$transaction([
      prisma.teamMember.create({
        data: {
          userId: user.id,
          teamId: invite.teamId,
          role: invite.role,
        },
      }),
      prisma.invite.delete({
        where: { id: inviteId },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { currentSessionTeamId: invite.teamId },
      }),
    ])
  );

  if (createError) {
    return { data: null, error: "Failed to accept invite" };
  }

  revalidatePath("/team");
  return { data: teamMember, error: null };
}

export async function rejectInvite(inviteId: string) {
  const { data: user, error: getCurrentUserError } = await tryCatch(
    getCurrentUser()
  );
  if (getCurrentUserError || !user) {
    return { data: null, error: "Unauthorized" };
  }

  // Get the invite and check if it's expired
  const { data: invite, error: inviteError } = await tryCatch(
    prisma.invite.findUnique({
      where: { id: inviteId },
    })
  );

  if (inviteError || !invite) {
    return { data: null, error: "Invite not found" };
  }

  if (new Date(invite.expiresAt) < new Date()) {
    return { data: null, error: "Invite has expired" };
  }

  // Delete the invite
  const { data: deletedInvite, error: deleteError } = await tryCatch(
    prisma.invite.delete({
      where: { id: inviteId },
    })
  );

  if (deleteError) {
    return { data: null, error: "Failed to reject invite" };
  }

  revalidatePath("/team");
  return { data: deletedInvite, error: null };
}

// list user teams
export async function getUserTeams() {
  const { data: user, error: getCurrentUserError } = await tryCatch(
    getCurrentUser()
  );
  if (getCurrentUserError || !user) {
    return { data: null, error: "Unauthorized" };
  }

  const { data: teams, error: teamsError } = await tryCatch(
    prisma.team.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
    })
  );

  if (teamsError) {
    return { data: null, error: "Failed to load teams" };
  }

  return { data: teams, error: null };
}

export async function updateUserProfile(data: {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: File;
}) {
  const { data: user, error: getCurrentUserError } = await tryCatch(
    getCurrentUser()
  );
  if (getCurrentUserError || !user) {
    return { data: null, error: "Unauthorized" };
  }

  const validatedData = updateUserProfileSchema.safeParse(data);
  if (!validatedData.success) {
    return { data: null, error: "Invalid data" };
  }

  // If email is being updated, check if it's already taken
  if (data.email && data.email !== user.email) {
    const { data: existingUser, error: existingUserError } = await tryCatch(
      prisma.user.findUnique({
        where: { email: data.email },
      })
    );

    if (existingUserError) {
      return { data: null, error: "Failed to check email availability" };
    }

    if (existingUser) {
      return { data: null, error: "Email already taken" };
    }
  }

  let avatarUrl = undefined;
  if (data.avatar) {
    const { data: uploadedAvatar, error: uploadFilesError } = await tryCatch(
      uploadFiles([data.avatar])
    );
    if (uploadFilesError || !uploadedAvatar) {
      return { data: null, error: "Failed to upload avatar" };
    }
    avatarUrl = uploadedAvatar[0];
  }

  const updateData: {
    name?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
  } = {};

  if (data.name) updateData.name = data.name;
  if (data.email) updateData.email = data.email;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (avatarUrl) updateData.avatarUrl = avatarUrl;

  const { data: updatedUser, error: updateUserError } = await tryCatch(
    prisma.user.update({
      where: { id: user.id },
      data: updateData,
    })
  );

  if (updateUserError) {
    return { data: null, error: "Failed to update user profile" };
  }

  // Remove password from response
  if (updatedUser) {
    updatedUser.password = "";
  }

  revalidatePath("/profile");
  return { data: updatedUser, error: null };
}
