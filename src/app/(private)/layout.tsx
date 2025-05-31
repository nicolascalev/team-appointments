import { getCurrentUser } from "@/actions/auth";
import LayoutClient from "./LayoutClient";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return null;
  }
  return <LayoutClient currentUser={currentUser}>{children}</LayoutClient>;
}
