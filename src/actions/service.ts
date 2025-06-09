"use server";

import { getCurrentUser } from "@/actions/auth";
import { prisma } from "@/lib/prisma";
import { tryCatch } from "@/lib/try-catch";
import { createServiceSchema } from "@/lib/validation-schemas";
import { revalidatePath } from "next/cache";
import { TeamRole, type Prisma } from "../../prisma/generated";

type CreateServiceData = Omit<Prisma.ServiceCreateInput, "team"> & {
  teamMembers: string[];
};

export async function createService(formData: CreateServiceData) {
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

  // Validate input
  const validatedData = createServiceSchema.parse(formData);

  const { data: service, error: createServiceError } = await tryCatch(
    prisma.service.create({
      data: {
        ...validatedData,
        team: {
          connect: {
            id: user.currentSessionTeamId,
          },
        },
        teamMembers: {
          connect: validatedData.teamMembers.map((memberId) => ({
            id: memberId,
          })),
        },
      },
      include: {
        teamMembers: true,
      },
    })
  );

  if (createServiceError || !service) {
    return { data: null, error: "Failed to create service" };
  }

  await revalidatePath("/admin");
  return { data: service, error: null };
}

