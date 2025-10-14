import { getCurrentUser } from "@/actions/auth";
import ProfilePageClient from "./ProfilePageClient";
import { redirect } from "next/navigation";


async function UserProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <ProfilePageClient user={user} />
  )
}

export default UserProfilePage