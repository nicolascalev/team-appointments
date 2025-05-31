import {
  startOfMonth,
  endOfMonth,
  addMinutes,
  isBefore,
  isAfter,
} from "date-fns";
import { prisma } from "@/lib/prisma";

type GetAvailableSlotsArgs = {
  teamId: string;
  serviceId: string;
  employeeIds?: string[]; // Optional filter
};

export async function getAvailableSlots({
  teamId,
  serviceId,
  employeeIds,
}: GetAvailableSlotsArgs) {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // Get service details for duration and buffer
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) throw new Error("Service not found");

  const duration = service.duration;
  const buffer = service.buffer;

  // Get team business hours
  const businessHours = await prisma.businessHour.findMany({
    where: { teamId },
  });

  // Get team settings (e.g., minBookingNotice)
  const settings = await prisma.teamSettings.findUnique({
    where: { teamId },
  });

  const minNotice = settings?.minBookingNoticeMinutes ?? 60;

  // Get employees
  const employees = await prisma.teamMember.findMany({
    where: {
      teamId,
      isActive: true,
      isSchedulable: true,
      ...(employeeIds ? { id: { in: employeeIds } } : {}),
    },
    include: {
      availability: true,
      blockOffs: {
        where: {
          OR: [{ start: { lte: monthEnd }, end: { gte: monthStart } }],
        },
      },
      appointments: {
        where: {
          start: { lte: monthEnd },
          end: { gte: monthStart },
        },
        include: { service: true },
      },
    },
  });

  const slotsByEmployee: Record<string, { date: string; slots: string[] }[]> =
    {};

  for (const employee of employees) {
    const availabilityByDay = Object.groupBy(
      employee.availability,
      (a) => a.dayOfWeek
    );

    const current = new Date(monthStart);
    const end = new Date(monthEnd);

    const employeeSlots: { date: string; slots: string[] }[] = [];

    while (current <= end) {
      const dayOfWeek = current.getDay();
      const dateStr = current.toISOString().split("T")[0];
      const availableTimes = availabilityByDay[dayOfWeek];

      const businessHour = businessHours.find((b) => b.dayOfWeek === dayOfWeek);
      if (!businessHour || !availableTimes?.length) {
        current.setDate(current.getDate() + 1);
        continue;
      }

      const dailySlots: string[] = [];

      for (const window of availableTimes) {
        const [startHour, startMin] = window.startTime.split(":").map(Number);
        const [endHour, endMin] = window.endTime.split(":").map(Number);
        const windowStart = new Date(current);
        windowStart.setHours(startHour, startMin, 0, 0);
        const windowEnd = new Date(current);
        windowEnd.setHours(endHour, endMin, 0, 0);

        // Apply business hours limits
        const [bizOpenH, bizOpenM] = businessHour.openTime
          .split(":")
          .map(Number);
        const [bizCloseH, bizCloseM] = businessHour.closeTime
          .split(":")
          .map(Number);
        const bizOpen = new Date(current);
        bizOpen.setHours(bizOpenH, bizOpenM, 0, 0);
        const bizClose = new Date(current);
        bizClose.setHours(bizCloseH, bizCloseM, 0, 0);

        const slotStart = new Date(
          Math.max(windowStart.getTime(), bizOpen.getTime())
        );
        const slotEnd = new Date(
          Math.min(windowEnd.getTime(), bizClose.getTime())
        );

        let cursor = new Date(slotStart);
        while (isBefore(addMinutes(cursor, duration + buffer), slotEnd)) {
          const appointmentEnd = addMinutes(cursor, duration);
          const bufferEnd = addMinutes(appointmentEnd, buffer);

          // Too soon to book?
          if (isBefore(cursor, addMinutes(now, minNotice))) {
            cursor = addMinutes(cursor, 15); // Skip 15 min and try again
            continue;
          }

          // Check overlap with blockOffs
          const blocked = employee.blockOffs.some(
            (block) =>
              isBefore(block.start, bufferEnd) && isAfter(block.end, cursor)
          );

          // Check overlap with appointments
          const hasConflict = employee.appointments.some((app) => {
            const appStart = new Date(app.start);
            const appEnd = new Date(app.end);
            const appBufferEnd = addMinutes(appEnd, app.service?.buffer ?? 0);
            return (
              isBefore(appStart, bufferEnd) && isAfter(appBufferEnd, cursor)
            );
          });

          if (!blocked && !hasConflict) {
            dailySlots.push(cursor.toISOString());
          }

          cursor = addMinutes(cursor, 15); // move to next potential slot
        }
      }

      if (dailySlots.length > 0) {
        employeeSlots.push({ date: dateStr, slots: dailySlots });
      }

      current.setDate(current.getDate() + 1);
    }

    slotsByEmployee[employee.id] = employeeSlots;
  }

  return slotsByEmployee;
}
