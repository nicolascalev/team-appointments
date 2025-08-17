import LayoutClient from "./LayoutClient";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutClient>{children}</LayoutClient>;
}
