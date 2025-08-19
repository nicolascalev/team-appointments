import { getTeamsEventsMonth } from "@/actions/appointment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const teams = searchParams.getAll('teams[]');
  const date = searchParams.get('date');

  if (!teams || !date) {
    return NextResponse.json(
      { error: "Missing required parameters: teams and date" },
      { status: 400 }
    );
  }

  const { data, error } = await getTeamsEventsMonth(teams, date);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json({ data });
}
