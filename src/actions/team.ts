"use server";

import { getCurrentUser } from "@/actions/auth";
import { uploadFiles } from "@/lib/file-uploads";
import { prisma } from "@/lib/prisma";
import { tryCatch } from "@/lib/try-catch";
import { CreateManyBusinessHoursInput } from "@/lib/types";
import { createTeamSchema } from "@/lib/validation-schemas";
import { revalidatePath } from "next/cache";
import { TeamRole, type Prisma } from "../../prisma/generated";

export async function createTeam(
  data: Prisma.TeamCreateInput & { avatar?: File }
) {
  try {
    const { data: user, error: getCurrentUserError } = await tryCatch(
      getCurrentUser()
    );
    if (getCurrentUserError || !user) {
      return { data: null, error: "Unauthorized" };
    }

    // Validate input
    const validatedData = createTeamSchema.parse(data);

    // Check if slug is available
    const { data: existingTeam, error: existingTeamError } = await tryCatch(
      prisma.team.findUnique({
        where: { slug: validatedData.slug },
      })
    );

    if (existingTeamError || existingTeam) {
      return { data: null, error: "Team slug already taken" };
    }

    const avatarUrl = data.avatar
      ? await uploadFiles([data.avatar])
      : undefined;
    delete validatedData.avatar;

    // Create team and add user as admin
    const { data: team, error: createTeamError } = await tryCatch(
      prisma.team.create({
        data: {
          ...validatedData,
          avatarUrl: avatarUrl?.[0] || undefined,
          members: {
            create: {
              userId: user.id,
              role: "ADMIN",
            },
          },
        },
      })
    );

    if (createTeamError || !team) {
      return { data: null, error: "Failed to create team" };
    }

    await tryCatch(
      prisma.user.update({
        where: { id: user.id },
        data: { currentSessionTeamId: team.id },
      })
    );

    revalidatePath("/team");
    revalidatePath("/admin");
    return { data: team, error: null };
  } catch (error) {
    console.error("Error creating team:", error);
    return { data: null, error: "Failed to create team" };
  }
}

export async function getUserCurrentSessionTeam() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  if (!user.currentSessionTeamId) {
    throw new Error("No current session team");
  }
  const team = await prisma.team.findUnique({
    where: { id: user.currentSessionTeamId },
    include: {
      members: {
        include: {
          user: true,
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
          _count: {
            select: {
              services: true,
            },
          },
        },
      },
      services: true,
      appointments: true,
      settings: true,
      businessHours: true,
    },
  });

  team?.members.forEach((member) => {
    member.user.password = "";
  });

  if (!team) {
    throw new Error("No current session team");
  }
  return team;
}

export async function updateTeam(
  data: Prisma.TeamUpdateInput & { avatar?: File }
) {
  const { data: user, error: getCurrentUserError } = await tryCatch(
    getCurrentUser()
  );
  if (getCurrentUserError || !user) {
    return { data: null, error: "Unauthorized" };
  }
  if (!user.currentSessionTeamId) {
    return { data: null, error: "No current session team" };
  }
  const validatedData = createTeamSchema.parse(data);

  let avatarUrl = undefined;
  if (data.avatar) {
    const { data: avatar, error: uploadFilesError } = await tryCatch(
      uploadFiles([data.avatar])
    );
    if (uploadFilesError || !avatar) {
      return { data: null, error: "Failed to upload avatar" };
    }
    avatarUrl = avatar[0];
  }
  delete validatedData.avatar;

  const { data: team, error: updateTeamError } = await tryCatch(
    prisma.team.update({
      where: { id: user.currentSessionTeamId },
      data: {
        ...validatedData,
        avatarUrl: avatarUrl || undefined,
      },
    })
  );
  revalidatePath("/admin");
  return { data: team, error: updateTeamError };
}

export async function updateTeamBusinessHours(
  data: CreateManyBusinessHoursInput
) {
  const { data: user, error: getCurrentUserError } = await tryCatch(
    getCurrentUser()
  );
  if (getCurrentUserError || !user) {
    return { data: null, error: "Unauthorized" };
  }
  if (!user.currentSessionTeamId) {
    return { data: null, error: "No current session team" };
  }
  const businessHoursInput = data.map((hour) => ({
    ...hour,
    teamId: user.currentSessionTeamId as string,
  }));

  const { error: deleteError } = await tryCatch(
    prisma.businessHour.deleteMany({
      where: { teamId: user.currentSessionTeamId },
    })
  );

  if (deleteError) {
    return { data: null, error: "Failed to delete existing business hours" };
  }

  const { data: businessHours, error: createError } = await tryCatch(
    prisma.businessHour.createMany({
      data: businessHoursInput,
    })
  );

  if (createError || !businessHours) {
    return { data: null, error: "Failed to update business hours" };
  }

  revalidatePath("/admin");
  return { data: businessHours, error: null };
}

export async function sendTeamInvites(emails: string[]): Promise<{
  data: number | null;
  error: string | null;
}> {
  const { data: user, error: getCurrentUserError } = await tryCatch(
    getCurrentUser()
  );
  if (getCurrentUserError || !user) {
    return { data: null, error: "Unauthorized" };
  }
  if (!user.currentSessionTeamId) {
    return { data: null, error: "No current session team" };
  }

  // Check if the user is an admin in the team
  const { data: teamMember, error: teamMemberError } = await tryCatch(
    prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: user.id,
          teamId: user.currentSessionTeamId,
        },
        role: TeamRole.ADMIN,
      },
    })
  );

  if (teamMemberError || !teamMember) {
    return { data: null, error: "Unauthorized" };
  }

  // Get existing team members to check for duplicates
  const { data: existingMembers, error: membersError } = await tryCatch(
    prisma.teamMember.findMany({
      where: { teamId: user.currentSessionTeamId },
      include: { user: true },
    })
  );

  if (membersError) {
    return { data: null, error: "Failed to fetch team members" };
  }

  // Get existing invites to avoid duplicates
  const { data: existingInvites, error: invitesError } = await tryCatch(
    prisma.invite.findMany({
      where: { teamId: user.currentSessionTeamId },
    })
  );

  if (invitesError) {
    return { data: null, error: "Failed to fetch existing invites" };
  }

  // Filter out emails that are already members or have pending invites
  const existingEmails = new Set([
    ...existingMembers.map((member) => member.user.email),
    ...existingInvites.map((invite) => invite.email),
  ]);

  const validEmails = emails.filter((email) => !existingEmails.has(email));

  if (validEmails.length === 0) {
    return { data: null, error: "No valid emails to invite" };
  }

  // Get users by email to link invites to existing users
  const { data: existingUsers, error: usersError } = await tryCatch(
    prisma.user.findMany({
      where: { email: { in: validEmails } },
    })
  );

  if (usersError) {
    return { data: null, error: "Failed to fetch existing users" };
  }

  const userMap = new Map(existingUsers.map((user) => [user.email, user]));

  // Create invites
  const invites = validEmails.map((email) => ({
    email,
    teamId: user.currentSessionTeamId as string,
    role: "MEMBER" as const,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    userId: userMap.get(email)?.id,
  }));

  const { data: createdInvites, error: createError } = await tryCatch(
    prisma.invite.createMany({
      data: invites,
    })
  );

  if (createError) {
    return { data: null, error: "Failed to create invites" };
  }

  revalidatePath("/admin");
  return { data: createdInvites?.count, error: null };
}

export async function loadTeamInvites() {
  const { data: user, error: getCurrentUserError } = await tryCatch(
    getCurrentUser()
  );
  if (getCurrentUserError || !user) {
    return { data: null, error: "Unauthorized" };
  }
  if (!user.currentSessionTeamId) {
    return { data: null, error: "No current session team" };
  }

  // Check if the user is an admin in the team
  const { data: teamMember, error: teamMemberError } = await tryCatch(
    prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: user.id,
          teamId: user.currentSessionTeamId,
        },
        role: TeamRole.ADMIN,
      },
    })
  );

  if (teamMemberError || !teamMember) {
    return { data: null, error: "Unauthorized" };
  }

  const { data: invites, error: invitesError } = await tryCatch(
    prisma.invite.findMany({
      where: { teamId: user.currentSessionTeamId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        expiresAt: "asc",
      },
    })
  );

  if (invitesError) {
    return { data: null, error: "Failed to fetch team invites" };
  }

  return { data: invites, error: null };
}

export async function cancelTeamInvite(inviteId: string) {
  const { data: user, error: getCurrentUserError } = await tryCatch(
    getCurrentUser()
  );
  if (getCurrentUserError || !user) {
    return { data: null, error: "Unauthorized" };
  }
  if (!user.currentSessionTeamId) {
    return { data: null, error: "No current session team" };
  }

  // Check if the user is an admin in the team
  const { data: teamMember, error: teamMemberError } = await tryCatch(
    prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: user.id,
          teamId: user.currentSessionTeamId,
        },
        role: TeamRole.ADMIN,
      },
    })
  );

  if (teamMemberError || !teamMember) {
    return { data: null, error: "Unauthorized" };
  }

  const { data: invite, error: deleteError } = await tryCatch(
    prisma.invite.delete({
      where: {
        id: inviteId,
        teamId: user.currentSessionTeamId,
      },
    })
  );

  if (deleteError) {
    return { data: null, error: "Failed to cancel invite" };
  }

  revalidatePath("/admin");
  return { data: invite, error: null };
}

export async function updateTeamInviteRole(inviteId: string, role: TeamRole) {
  const { data: user, error: getCurrentUserError } = await tryCatch(
    getCurrentUser()
  );
  if (getCurrentUserError || !user) {
    return { data: null, error: "Unauthorized" };
  }
  if (!user.currentSessionTeamId) {
    return { data: null, error: "No current session team" };
  }

  // Check if the user is an admin in the team
  const { data: teamMember, error: teamMemberError } = await tryCatch(
    prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: user.id,
          teamId: user.currentSessionTeamId,
        },
        role: TeamRole.ADMIN,
      },
    })
  );

  if (teamMemberError || !teamMember) {
    return { data: null, error: "Unauthorized" };
  }

  const { data: invite, error: updateError } = await tryCatch(
    prisma.invite.update({
      where: {
        id: inviteId,
        teamId: user.currentSessionTeamId,
      },
      data: {
        role,
      },
    })
  );

  if (updateError) {
    return { data: null, error: "Failed to update invite role" };
  }

  revalidatePath("/admin");
  return { data: invite, error: null };
}

export async function loadTeamServices() {
  const { data: user, error: getCurrentUserError } = await tryCatch(
    getCurrentUser()
  );
  if (getCurrentUserError || !user) {
    return { data: null, error: "Unauthorized" };
  }
  if (!user.currentSessionTeamId) {
    return { data: null, error: "No current session team" };
  }

  const { data: services, error: servicesError } = await tryCatch(
    prisma.service.findMany({
      where: { teamId: user.currentSessionTeamId },
      include: {
        teamMembers: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })
  );

  services?.forEach((service) => {
    service.teamMembers.forEach((member) => {
      member.user.password = "";
    });
  });

  if (servicesError) {
    return { data: null, error: "Failed to fetch team services" };
  }

  return { data: services, error: null };
}
