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

export async function getServiceBookingPageData(serviceId: string) {
  const { data: service, error: serviceError } = await tryCatch(
    prisma.service.findUnique({
      where: {
        id: serviceId,
      },
      include: {
        team: {
          include: {
            settings: true,
            businessHours: true,
            members: {
              where: {
                isActive: true,
                isSchedulable: true,
                services: {
                  some: {
                    id: serviceId,
                  },
                },
              },
              include: {
                user: true,
              },
            },
          },
        },
      },
    })
  );

  if (!service) {
    return { data: null, error: "Service not found" };
  }

  if (serviceError) {
    return { data: null, error: "Failed to load service" };
  }

  return { data: service, error: null };
}
