"use server";

import { getCurrentUser } from "@/actions/auth";
import { uploadFiles } from "@/lib/file-uploads";
import { prisma } from "@/lib/prisma";
import {
  createTeamSchema,
  type CreateTeamInput,
} from "@/lib/validation-schemas";
import { revalidatePath } from "next/cache";

export async function createTeam(data: CreateTeamInput) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Validate input
    const validatedData = createTeamSchema.parse(data);

    // Check if slug is available
    const existingTeam = await prisma.team.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingTeam) {
      throw new Error("Team slug already taken");
    }

    const avatarUrl = data.avatar ? await uploadFiles([data.avatar]) : undefined;
    delete validatedData.avatar;

    // Create team and add user as admin
    const team = await prisma.team.create({
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
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { currentSessionTeamId: team.id },
    });

    revalidatePath("/team");
    revalidatePath("/admin");
    return { success: true, team };
  } catch (error) {
    console.error("Error creating team:", error);
    return { success: false, error: "Failed to create team" };
  }
}
