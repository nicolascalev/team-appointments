import { getAdminDashboardStats } from "@/actions/adminDashboard";
import {
  Container,
  Text
} from "@mantine/core";
import AdminDashboardClient from "./AdminDashboardClient";

async function AdminDashboard() {
  const { data: stats, error } = await getAdminDashboardStats();

  if (error || !stats) {
    return (
      <Container mx={{ base: "-md", sm: "auto" }} p={{ base: "md", sm: 0 }}>
        <Text c="red">Error loading dashboard stats: {error?.message}</Text>
      </Container>
    );
  }

  return (
    <AdminDashboardClient stats={stats} />
  );
}

export default AdminDashboard;
