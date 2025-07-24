"use server";

import { prisma } from "@/lib/prisma";
import { AppointmentStatus } from "../../prisma/generated";
import { tryCatch } from "@/lib/try-catch";
import { revalidatePath } from "next/cache";

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
