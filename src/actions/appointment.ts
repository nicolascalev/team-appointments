"use server";

import { prisma } from "@/lib/prisma";
import { AppointmentStatus } from "../../prisma/generated";
import { tryCatch } from "@/lib/try-catch";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";
import moment from "moment";

export async function getAppointment(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      service: true,
      team: {
        include: {
          settings: true,
        },
      },
      teamMember: {
        include: {
          user: true,
        },
      },
      user: true,
    },
  });

  return appointment;
}

export async function cancelAppointment(appointmentId: string) {
  const { data: appointment, error } = await tryCatch(
    prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.CANCELLED },
    })
  );

  if (error) {
    return { data: null, error };
  }

  await revalidatePath("/confirmation/" + appointmentId);

  return { data: appointment, error };
}

export async function getTeamsAppointmentsMonth(teams: string[], date: string) {
  // Get current user
  const { data: currentUser, error: userError } = await tryCatch(getCurrentUser());
  if (userError || !currentUser) {
    return { data: null, error: userError || new Error("User not authenticated") };
  }

  // Validate that user belongs to the selected teams
  const { data: userTeamMemberships, error: membershipError } = await tryCatch(
    prisma.teamMember.findMany({
      where: {
        userId: currentUser.id,
        teamId: { in: teams },
        isActive: true,
      },
      select: {
        teamId: true,
        id: true,
      },
    })
  );

  if (membershipError) {
    return { data: null, error: membershipError };
  }

  const userTeamIds = userTeamMemberships.map(tm => tm.teamId);
  const userTeamMemberIds = userTeamMemberships.map(tm => tm.id);

  // Check if user has access to all requested teams
  if (userTeamIds.length !== teams.length) {
    return { data: null, error: new Error("User does not have access to all selected teams") };
  }

  // Calculate start and end of month
  const targetDate = moment(date).toDate();
  const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
  const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999);

  // Fetch appointments for the month
  const { data: appointments, error: appointmentsError } = await tryCatch(
    prisma.appointment.findMany({
      where: {
        teamId: { in: teams },
        teamMemberId: { in: userTeamMemberIds }, // Only appointments assigned to the current user
        start: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        // status: {
        //   not: AppointmentStatus.CANCELLED,
        // },
      },
      include: {
        team: {
          include: {
            settings: true,
          },
        },
        teamMember: {
          include: {
            user: true,
          },
        },
        service: true,
        user: true, // Client information
      },
      orderBy: {
        start: 'asc',
      },
    })
  );

  if (appointmentsError) {
    return { data: null, error: appointmentsError };
  }

  return { data: appointments, error: null };
}
