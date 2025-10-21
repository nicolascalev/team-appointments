import { getTeamMembersEventsMonth } from "@/actions/appointment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const teamMembers = searchParams.getAll('teamMembers[]');
  const date = searchParams.get('date');

  if (!teamMembers || !date) {
    return NextResponse.json(
      { error: "Missing required parameters: teamMembers and date" },
      { status: 400 }
    );
  }

  const { data, error } = await getTeamMembersEventsMonth(teamMembers, date);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json({ data });
}
