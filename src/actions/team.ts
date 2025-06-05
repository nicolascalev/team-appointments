"use server";

import { getCurrentUser } from "@/actions/auth";
import { uploadFiles } from "@/lib/file-uploads";
import { prisma } from "@/lib/prisma";
import { createTeamSchema } from "@/lib/validation-schemas";
import { revalidatePath } from "next/cache";
import type { Prisma } from "../../prisma/generated";
import { tryCatch } from "@/lib/try-catch";
import { CreateManyBusinessHoursInput } from "@/lib/types";

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
      members: true,
      services: true,
      appointments: true,
      settings: true,
      businessHours: true,
    },
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
      where: { teamId: user.currentSessionTeamId }
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
