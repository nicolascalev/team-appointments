"use server";

import { getCurrentUser } from "@/actions/auth";
import { prisma } from "@/lib/prisma";
import { tryCatch } from "@/lib/try-catch";
// import { createServiceSchema } from "@/lib/validation-schemas";
// import { revalidatePath } from "next/cache";
import { TeamRole } from "../../prisma/generated";

export async function getTeamMember(teamMemberId: string) {
  const { data: currentUserCanUpdate, error: errorCurrentUserCanUpdate } = await tryCatch(
    currentUserIsAdminOfMember(teamMemberId)
  );

  if (errorCurrentUserCanUpdate || !currentUserCanUpdate) {
    return { data: null, error: errorCurrentUserCanUpdate };
  }

  const { data: teamMember, error: teamMemberError } = await tryCatch(
    prisma.teamMember.findUnique({
      where: { id: teamMemberId },
      include: {
        team: {
          include: {
            businessHours: true,
            services: true,
          },
        },
        blockOffs: true,
        services: true,
        user: true,
        availability: true,
      },
    })
  );

  if (teamMemberError) {
    return { data: null, error: teamMemberError };
  }

  console.log(teamMember);
  return { data: teamMember, error: null };
}

// this function checks if the current user is an admin of the team member
export async function currentUserIsAdminOfMember(teamMemberId: string) {
  const { data: user, error: getCurrentUserError } = await tryCatch(
    getCurrentUser()
  );
  if (getCurrentUserError || !user) {
    return { data: null, error: "Unauthorized" };
  }

  if (!user.currentSessionTeamId) {
    return { data: null, error: "No current session team" };
  }

  const { data: currentUserTeamMember, error: currentUserTeamMemberError } = await tryCatch(
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

  if (currentUserTeamMemberError || !currentUserTeamMember) {
    return { data: null, error: "Unauthorized" };
  }

  const { data: teamMember, error: teamMemberError } = await tryCatch(
    // check if the current user is an admin of the team member
    prisma.teamMember.findUnique({
      where: { id: teamMemberId, teamId: currentUserTeamMember.teamId },
    })
  );

  if (teamMemberError || !teamMember) {
    return { data: null, error: "Team member not found" };
  }

  return { data: teamMember, error: null };
}