"use server";

import { prisma } from "@/lib/prisma";

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
