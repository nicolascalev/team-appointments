"use server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./auth";
import { tryCatch } from "@/lib/try-catch";
import { revalidatePath } from "next/cache";

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
