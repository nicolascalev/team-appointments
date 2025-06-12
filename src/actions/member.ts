"use server";

import { getCurrentUser } from "@/actions/auth";
import { prisma } from "@/lib/prisma";
import { tryCatch } from "@/lib/try-catch";
import { Service, TeamRole } from "../../prisma/generated";
import { AvailabilityInput, BlockOff } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function getTeamMember(teamMemberId: string) {
  const { data: currentUserCanUpdate, error: errorCurrentUserCanUpdate } =
    await tryCatch(currentUserIsAdminOfMember(teamMemberId));

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

  const { data: currentUserTeamMember, error: currentUserTeamMemberError } =
    await tryCatch(
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

export async function updateTeamMember(
  teamMemberId: string,
  data: {
    isActive: boolean;
    role: TeamRole;
    isSchedulable: boolean;
    availability: AvailabilityInput[];
    blockOffs: BlockOff[];
    services: Service[];
  }
) {
  const { data: currentUserCanUpdate, error: errorCurrentUserCanUpdate } =
    await tryCatch(currentUserIsAdminOfMember(teamMemberId));

  if (errorCurrentUserCanUpdate || !currentUserCanUpdate) {
    return { data: null, error: "Unauthorized" };
  }

  const { data: updatedTeamMember, error: updateError } = await tryCatch(
    prisma.teamMember.update({
      where: { id: teamMemberId },
      data: {
        isActive: data.isActive,
        role: data.role,
        isSchedulable: data.isSchedulable,
        // Delete existing availability and blockOffs
        availability: {
          deleteMany: {},
        },
        blockOffs: {
          deleteMany: {},
        },
        // Unlink all services
        services: {
          set: [],
        },
      },
    })
  );

  if (updateError) {
    return { data: null, error: "Error updating team member" };
  }

  // Create new availability records
  const { error: availabilityError } = await tryCatch(
    prisma.employeeAvailability.createMany({
      data: data.availability.map((avail) => ({
        ...avail,
        teamMemberId,
      })),
    })
  );

  if (availabilityError) {
    return { data: null, error: "Error updating schedule" };
  }

  // Create new blockOff records
  const { error: blockOffsError } = await tryCatch(
    prisma.employeeBlockOff.createMany({
      data: data.blockOffs.map((blockOff) => ({
        teamMemberId,
        start: new Date(blockOff.start),
        end: new Date(blockOff.end),
        reason: blockOff.reason,
      })),
    })
  );

  if (blockOffsError) {
    return { data: null, error: "Error updating block offs" };
  }

  // Link new services
  const { error: servicesError } = await tryCatch(
    prisma.teamMember.update({
      where: { id: teamMemberId },
      data: {
        services: {
          connect: data.services.map((service) => ({ id: service.id })),
        },
      },
    })
  );

  if (servicesError) {
    return { data: null, error: "Error updating services" };
  }

  await revalidatePath(`/admin`);
  return { data: updatedTeamMember, error: null };
}
