import { startOfDay, endOfDay, addMinutes, isBefore, isAfter, isEqual } from "date-fns";
import { prisma } from "@/lib/prisma";
import moment from "moment";

type GetAvailableSlotsArgs = {
  teamId: string;
  serviceId: string;
  employeeIds?: string[]; // Optional filter
  date?: string;
};

export async function getAvailableSlots({
  teamId,
  serviceId,
  employeeIds,
  date,
}: GetAvailableSlotsArgs) {
  if (!teamId || !serviceId) return [];

  const now = new Date();
  const dayStart = startOfDay(date ? moment(date).toDate() : now);
  const dayEnd = endOfDay(date ? moment(date).toDate() : now);

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) throw new Error("Service not found");

  const { duration, buffer } = service;

  const businessHours = await prisma.businessHour.findMany({ where: { teamId } });

  const settings = await prisma.teamSettings.findUnique({ where: { teamId } });
  const minNotice = settings?.minBookingNoticeMinutes ?? 5;

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
          OR: [{ start: { lte: dayEnd }, end: { gte: dayStart } }],
        },
      },
      appointments: {
        where: {
          start: { lte: dayEnd },
          end: { gte: dayStart },
        },
        include: { service: true },
      },
    },
  });

  const slotsByEmployee: Record<string, { date: string; slots: string[] }[]> = {};

  for (const employee of employees) {
    const availabilityByDay = Object.groupBy(employee.availability, (a) => a.dayOfWeek);
    const employeeSlots: { date: string; slots: string[] }[] = [];

    const current = new Date(dayStart);

    while (isBefore(current, dayEnd) || isEqual(current, dayEnd)) {
      const dayOfWeek = current.getDay();
      const currentDate = new Date(current); // clone for safety
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

        const windowStart = new Date(currentDate);
        windowStart.setHours(startHour, startMin, 0, 0);
        const windowEnd = new Date(currentDate);
        windowEnd.setHours(endHour, endMin, 0, 0);

        const [bizOpenH, bizOpenM] = businessHour.openTime.split(":").map(Number);
        const [bizCloseH, bizCloseM] = businessHour.closeTime.split(":").map(Number);
        const bizOpen = new Date(currentDate);
        bizOpen.setHours(bizOpenH, bizOpenM, 0, 0);
        const bizClose = new Date(currentDate);
        bizClose.setHours(bizCloseH, bizCloseM, 0, 0);

        const slotStart = new Date(Math.max(windowStart.getTime(), bizOpen.getTime()));
        const slotEnd = new Date(Math.min(windowEnd.getTime(), bizClose.getTime()));

        let cursor = new Date(slotStart);
        while (isBefore(addMinutes(cursor, duration + buffer), slotEnd)) {
          const appointmentEnd = addMinutes(cursor, duration);
          const bufferEnd = addMinutes(appointmentEnd, buffer);

          if (isBefore(cursor, addMinutes(now, minNotice))) {
            cursor = addMinutes(cursor, duration + buffer);
            continue;
          }

          const blocked = employee.blockOffs.some(
            (block) => isBefore(block.start, bufferEnd) && isAfter(block.end, cursor)
          );

          const hasConflict = employee.appointments.some((app) => {
            const appStart = new Date(app.start);
            const appEnd = new Date(app.end);
            const appBufferEnd = addMinutes(appEnd, app.service?.buffer ?? 0);
            return isBefore(appStart, bufferEnd) && isAfter(appBufferEnd, cursor);
          });

          if (!blocked && !hasConflict) {
            dailySlots.push(cursor.toISOString());
          }

          cursor = addMinutes(cursor, duration + buffer);
        }
      }

      if (dailySlots.length > 0) {
        employeeSlots.push({ date: currentDate.toUTCString(), slots: dailySlots });
      }

      current.setDate(current.getDate() + 1);
    }

    slotsByEmployee[employee.id] = employeeSlots;
  }

  const slotsDataFormatted = new Set(
    Object.values(slotsByEmployee).flatMap((dates) =>
      dates.flatMap((date) => date.slots)
    )
  );

  return Array.from(slotsDataFormatted);
}


// Function to validate if a slot is available at booking time
// This can be used to check availability just before creating a booking
// in case the user left the page open for a while

export async function validateSlotAvailability({
  teamId,
  serviceId,
  employeeId,
  startTime,
}: {
  teamId: string;
  serviceId: string;
  employeeId: string;
  startTime: string;
}) {
  const { tryCatch } = await import("@/lib/try-catch");
  
  const validateSlotResult = await tryCatch((async () => {
    const start = new Date(startTime);
    
    // Get service details
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });
    
    if (!service) throw new Error("Service not found");
    
    const duration = service.duration;
    const buffer = service.buffer;
    const appointmentEnd = addMinutes(start, duration);
    const bufferEnd = addMinutes(appointmentEnd, buffer);
    
    // Get employee with current availability and conflicts
    const employee = await prisma.teamMember.findFirst({
      where: {
        id: employeeId,
        teamId,
        isActive: true,
        isSchedulable: true,
      },
      include: {
        availability: {
          where: {
            dayOfWeek: start.getDay(),
          },
        },
        blockOffs: {
          where: {
            OR: [{ start: { lte: bufferEnd }, end: { gte: start } }],
          },
        },
        appointments: {
          where: {
            start: { lte: bufferEnd },
            end: { gte: start },
          },
          include: { service: true },
        },
      },
    });
    
    if (!employee) throw new Error("Employee not found or not available");
    
    // Check if employee is available on this day
    const dayAvailability = employee.availability.find(
      (a) => a.dayOfWeek === start.getDay()
    );
    
    if (!dayAvailability) throw new Error("Employee not available on this day");
    
    // Check if the time falls within availability window
    const [startHour, startMin] = dayAvailability.startTime.split(":").map(Number);
    const [endHour, endMin] = dayAvailability.endTime.split(":").map(Number);
    
    const availabilityStart = new Date(start);
    availabilityStart.setHours(startHour, startMin, 0, 0);
    const availabilityEnd = new Date(start);
    availabilityEnd.setHours(endHour, endMin, 0, 0);
    
    if (start < availabilityStart || appointmentEnd > availabilityEnd) {
      throw new Error("Time slot outside of employee availability");
    }
    
    // Check business hours
    const businessHour = await prisma.businessHour.findFirst({
      where: {
        teamId,
        dayOfWeek: start.getDay(),
      },
    });
    
    if (businessHour) {
      const [bizOpenH, bizOpenM] = businessHour.openTime.split(":").map(Number);
      const [bizCloseH, bizCloseM] = businessHour.closeTime.split(":").map(Number);
      
      const bizOpen = new Date(start);
      bizOpen.setHours(bizOpenH, bizOpenM, 0, 0);
      const bizClose = new Date(start);
      bizClose.setHours(bizCloseH, bizCloseM, 0, 0);
      
      if (start < bizOpen || appointmentEnd > bizClose) {
        throw new Error("Time slot outside of business hours");
      }
    }
    
    // Check for block offs
    if (employee.blockOffs.length > 0) {
      throw new Error("Time slot conflicts with blocked off time");
    }
    
    // Check for existing appointments
    if (employee.appointments.length > 0) {
      throw new Error("Time slot conflicts with existing appointment");
    }
    
    // Check minimum booking notice
    const settings = await prisma.teamSettings.findUnique({
      where: { teamId },
    });
    
    const minNotice = settings?.minBookingNoticeMinutes ?? 5;
    const now = new Date();
    
    if (start < addMinutes(now, minNotice)) {
      throw new Error("Booking too close to current time");
    }
    
    return { available: true };
  })());
  
  return validateSlotResult;
}