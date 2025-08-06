import { getCurrentUser } from "@/actions/auth";
import { getUserTeams } from "@/actions/user";
import { redirect } from "next/navigation";
import DashboardClient from "./client";

async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: teams, error: teamsError } = await getUserTeams();

  if (teamsError || !teams) {
    return <div>{teamsError}</div>;
  }

  return <DashboardClient teams={teams} />;
}

export default DashboardPage;
