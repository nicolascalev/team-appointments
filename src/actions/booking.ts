import { prisma } from "@/lib/prisma";
import { tryCatch } from "@/lib/try-catch";

export async function getBookingPageData(slug: string) {
  // we select the team and include the services that are active and have a member that is schedulable, active, and has a service assigned
  const { data: team, error: teamError } = await tryCatch(
    prisma.team.findUnique({
      where: {
        slug,
      },
      include: {
        members: {
          where: {
            isActive: true,
          },
          include: {
            user: true,
          },
        },
        businessHours: true,
        services: {
          where: {
            isActive: true,
            teamMembers: {
              some: {
                isSchedulable: true,
                isActive: true,
              },
            },
          },
        },
      },
    })
  );

  if (!team) {
    return { data: null, error: "Team not found" };
  }

  if (teamError) {
    return { data: null, error: "Failed to load team" };
  }

  return { data: team, error: null };
}
