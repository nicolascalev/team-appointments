import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AppointmentStatus } from "../../../../../prisma/generated";
import { tryCatch } from "@/lib/try-catch";

export async function POST(request: NextRequest) {
  // Check if CRON_TOKEN is configured
  const cronToken = process.env.CRON_TOKEN;
  if (!cronToken) {
    return NextResponse.json(
      { error: "CRON_TOKEN environment variable is not configured" },
      { status: 500 }
    );
  }

  // Get token from request body
  const body = await request.json();
  const providedToken = body?.token;

  // Validate token
  if (!providedToken || providedToken !== cronToken) {
    return NextResponse.json(
      { error: "Invalid or missing token" },
      { status: 401 }
    );
  }

  // Calculate time range: last 24 hours
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Update appointments that ended within the last 24 hours to COMPLETED status
  const updateAppointmentsResult = await tryCatch(
    prisma.appointment.updateMany({
      where: {
        end: {
          gte: twentyFourHoursAgo, // Within last 24 hours
          lte: now, // And have ended
        },
        status: {
          notIn: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED], // Only update if not already completed
        },
      },
      data: {
        status: AppointmentStatus.COMPLETED,
      },
    })
  );

  if (updateAppointmentsResult.error) {
    return NextResponse.json(
      { error: updateAppointmentsResult.error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Successfully updated ${updateAppointmentsResult.data.count} appointment(s) to COMPLETED status`,
    count: updateAppointmentsResult.data.count,
  });
}
