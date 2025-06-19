import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/actions/slots";
import { tryCatch } from "@/lib/try-catch";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamSlug: string }> }
) {
  const { teamSlug } = await params;
  const { searchParams } = new URL(request.url);
  
  const serviceId = searchParams.get('serviceId');
  const date = searchParams.get('date');
  const employeeIds = searchParams.get('employeeIds');
  
  if (!serviceId) {
    return NextResponse.json(
      { error: 'serviceId is required' },
      { status: 400 }
    );
  }

  const getSlotsResult = await tryCatch(
    (async () => {
      // Look up the team by slug
      const team = await prisma.team.findUnique({
        where: { slug: teamSlug },
        select: { id: true }
      });
      
      if (!team) {
        throw new Error('Team not found');
      }
      
      const slots = await getAvailableSlots({
        teamId: team.id,
        serviceId,
        date: date || undefined,
        employeeIds: employeeIds ? employeeIds.split(',') : undefined,
      });
      
      return slots;
    })()
  );

  if (getSlotsResult.error) {
    return NextResponse.json(
      { error: getSlotsResult.error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: getSlotsResult.data });
}
