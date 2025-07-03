"use server";
import { prisma } from "@/lib/prisma";
import { tryCatch } from "@/lib/try-catch";
import { validateSlotAvailability } from "./slots";
import moment from "moment";

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
                availability: true,
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

// TODO: double check this function and the appointment availability function because I think it's not doing the date math correctly
export async function createBooking(data: {
  name: string;
  email: string;
  serviceId: string;
  employeeIds: string[];
  timeSlot: string;
}) {
  // Get the service to get the teamId
  const { data: service, error: serviceError } = await tryCatch(
    prisma.service.findUnique({
      where: { id: data.serviceId },
      select: { teamId: true, duration: true },
    })
  );

  if (serviceError || !service) {
    return { data: null, error: "Service not found" };
  }

  // Validate availability for each employee and find available ones
  const availableEmployees = [];
  
  for (const employeeId of data.employeeIds) {
    const { data: validationResult, error: validationError } = await validateSlotAvailability({
      teamId: service.teamId,
      serviceId: data.serviceId,
      employeeId,
      startTime: data.timeSlot,
    });

    if (!validationError && validationResult?.available) {
      availableEmployees.push(employeeId);
    }
  }

  if (availableEmployees.length === 0) {
    return { data: null, error: "No team members are available for this time slot" };
  }

  // Randomly select one available employee
  const selectedEmployeeId = availableEmployees[Math.floor(Math.random() * availableEmployees.length)];

  // Create the appointment with the selected employee
  const startTime = moment(data.timeSlot).toDate();
  const endTime = new Date(startTime.getTime() + service.duration * 60 * 1000);

  const { data: appointment, error } = await tryCatch(
    prisma.appointment.create({
      data: {
        teamId: service.teamId,
        clientName: data.name,
        clientEmail: data.email,
        serviceId: data.serviceId,
        teamMemberId: selectedEmployeeId,
        start: startTime,
        end: endTime,
      },
      include: {
        service: true,
        teamMember: {
          include: {
            user: true,
          },
        },
      },
    })
  );

  if (error) {
    return { data: null, error: "Failed to create booking" };
  }

  return { data: appointment, error: null };
}
