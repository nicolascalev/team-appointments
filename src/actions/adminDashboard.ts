"use server";

import { prisma } from "@/lib/prisma";
import { tryCatch } from "@/lib/try-catch";
import { getCurrentUser } from "./auth";
import { AppointmentStatus } from "../../prisma/generated";
import { AdminDashboardStats } from "@/lib/types";

export async function getAdminDashboardStats() {
  const { data: currentUser, error: userError } =
    await tryCatch(getCurrentUser());
  if (userError || !currentUser) {
    return {
      data: null,
      error: userError || new Error("User not authenticated"),
    };
  }

  if (!currentUser.currentSessionTeamId) {
    return {
      data: null,
      error: new Error("User is not an admin of any teams"),
    };
  }

  // Get user's teams where they are admin
  const { data: userTeams, error: teamsError } = await tryCatch(
    prisma.teamMember.findMany({
      where: {
        userId: currentUser.id,
        isActive: true,
        role: "ADMIN",
        team: {
          id: currentUser.currentSessionTeamId,
        },
      },
      select: {
        teamId: true,
      },
    })
  );

  if (teamsError) {
    return { data: null, error: teamsError };
  }

  if (userTeams.length === 0) {
    return {
      data: null,
      error: new Error("User is not an admin of any teams"),
    };
  }

  const teamIds = userTeams.map((t) => t.teamId);

  // Calculate date ranges
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );
  const startOfNextWeek = new Date(now);
  startOfNextWeek.setDate(now.getDate() + 7);
  startOfNextWeek.setHours(0, 0, 0, 0);
  const endOfNextWeek = new Date(startOfNextWeek);
  endOfNextWeek.setHours(23, 59, 59, 999);

  // Get all team members for the user's teams
  const { data: allTeamMembers, error: membersError } = await tryCatch(
    prisma.teamMember.findMany({
      where: {
        teamId: { in: teamIds },
        isActive: true,
      },
      include: {
        availability: true,
        blockOffs: {
          where: {
            start: {
              lte: endOfToday,
            },
            end: {
              gte: startOfToday,
            },
          },
        },
        user: true,
      },
    })
  );

  if (membersError) {
    return { data: null, error: membersError };
  }

  const teamMemberIds = allTeamMembers.map((tm) => tm.id);

  // 1. Total appointments this month
  const { data: totalAppointmentsThisMonth, error: totalAppointmentsError } =
    await tryCatch(
      prisma.appointment.count({
        where: {
          teamId: { in: teamIds },
          start: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      })
    );

  if (totalAppointmentsError) {
    return { data: null, error: totalAppointmentsError };
  }

  // 2. Today's appointments
  const { data: todaysAppointments, error: todaysAppointmentsError } =
    await tryCatch(
      prisma.appointment.count({
        where: {
          teamId: { in: teamIds },
          start: {
            gte: startOfToday,
            lte: endOfToday,
          },
          status: AppointmentStatus.CONFIRMED,
        },
      })
    );

  if (todaysAppointmentsError) {
    return { data: null, error: todaysAppointmentsError };
  }

  // 3. Upcoming appointments (next 7 days)
  const { data: upcomingAppointments, error: upcomingAppointmentsError } =
    await tryCatch(
      prisma.appointment.count({
        where: {
          teamId: { in: teamIds },
          start: {
            gte: now,
            lte: endOfNextWeek,
          },
          status: AppointmentStatus.CONFIRMED,
        },
      })
    );

  if (upcomingAppointmentsError) {
    return { data: null, error: upcomingAppointmentsError };
  }

  // 4. Cancelled this month
  const { data: cancelledThisMonth, error: cancelledThisMonthError } =
    await tryCatch(
      prisma.appointment.count({
        where: {
          teamId: { in: teamIds },
          start: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
          status: AppointmentStatus.CANCELLED,
        },
      })
    );

  if (cancelledThisMonthError) {
    return { data: null, error: cancelledThisMonthError };
  }

  // 5. Active team members (currently during a confirmed appointment)
  const { data: activeMembersCount, error: activeMembersError } =
    await tryCatch(
      prisma.appointment.findMany({
        where: {
          teamId: { in: teamIds },
          teamMemberId: { in: teamMemberIds },
          start: {
            lte: now,
          },
          end: {
            gte: now,
          },
          status: AppointmentStatus.CONFIRMED,
        },
        select: {
          teamMemberId: true,
        },
        distinct: ["teamMemberId"],
      })
    );

  if (activeMembersError) {
    return { data: null, error: activeMembersError };
  }

  // Get the actual User objects for active members
  const { data: activeMembers, error: activeMembersUsersError } = await tryCatch(
    prisma.teamMember.findMany({
      where: {
        id: { in: activeMembersCount.map((am) => am.teamMemberId) },
      },
      include: {
        user: true,
      },
    })
  );

  if (activeMembersUsersError) {
    return { data: null, error: activeMembersUsersError };
  }

  // 6. Members with upcoming availability (have available slots the rest of the day)
  const today = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const membersWithUpcomingAvailability = allTeamMembers.filter((member) => {
    // Check if member has availability for today
    const hasAvailabilityToday = member.availability.some(
      (avail) => avail.dayOfWeek === today
    );

    // Check if member is schedulable and doesn't have block off today
    const isSchedulable = member.isSchedulable;
    const hasBlockOffToday = member.blockOffs.length > 0;

    return hasAvailabilityToday && isSchedulable && !hasBlockOffToday;
  });

  // 7. Members on schedule today (their schedule includes today)
  const membersOnScheduleToday = allTeamMembers.filter((member) => {
    return member.availability.some((avail) => avail.dayOfWeek === today);
  });

  // 8. Staff off work today (have block off today OR isSchedulable is false)
  const staffOffWorkToday = allTeamMembers.filter((member) => {
    const hasBlockOffToday = member.blockOffs.length > 0;
    const isNotSchedulable = !member.isSchedulable;

    return hasBlockOffToday || isNotSchedulable;
  });

  return {
    data: {
      totalAppointmentsThisMonth,
      todaysAppointments,
      upcomingAppointments,
      cancelledThisMonth,
      activeMembers: activeMembers.map((tm) => tm.user),
      membersWithUpcomingAvailability: membersWithUpcomingAvailability.map((m) => m.user),
      membersOnScheduleToday: membersOnScheduleToday.map((m) => m.user),
      staffOffWorkToday: staffOffWorkToday.map((m) => m.user),
    } as AdminDashboardStats,
    error: null,
  };
}
