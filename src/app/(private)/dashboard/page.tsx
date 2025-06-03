"use client";
import FullCalendar from "@/components/FullCalendar";
import TeamsToggle from "@/components/TeamsToggle";
import { Container, Flex, Text } from "@mantine/core";

function DashboardPage() {
  const mockAppointments = [
    {
      id: "1",
      start: new Date(new Date().setHours(10, 0)),
      end: new Date(new Date().setHours(11, 0)),
      clientName: "John Smith",
    },
    {
      id: "2",
      start: new Date(new Date().setDate(new Date().getDate() + 2)),
      end: new Date(new Date().setDate(new Date().getDate() + 2)),
      clientName: "Jane Doe",
    },
    {
      id: "3",
      start: new Date(new Date().setDate(new Date().getDate() + 4)),
      end: new Date(new Date().setDate(new Date().getDate() + 4)),
      clientName: "Bob Wilson",
    },
  ];

  return (
    <Container mx={{ base: "-md", sm: "auto" }} p={{ base: "md", sm: 0 }}>
      <Flex direction="column" gap="xl">
        <Flex direction="column" gap="md">
          <div>
            <Text fw={500}>Calendars</Text>
            <Text c="dimmed" size="sm">
              Show your appointments for the selected teams
            </Text>
          </div>
          <TeamsToggle
            teams={[
              {
                id: "1",
                name: "Team Alpha",
                slug: "team-alpha",
                location: "New York",
                contactEmail: "alpha@example.com",
                contactPhone: "+1234567890",
                timezone: "America/New_York",
                category: "Medical",
                bio: "Primary care team",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              {
                id: "2",
                name: "Team Beta",
                slug: "team-beta",
                location: "Los Angeles",
                contactEmail: "beta@example.com",
                contactPhone: "+1234567891",
                timezone: "America/Los_Angeles",
                category: "Dental",
                bio: "Dental care specialists",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              {
                id: "3",
                name: "Team Gamma",
                slug: "team-gamma",
                location: "Chicago",
                contactEmail: "gamma@example.com",
                contactPhone: "+1234567892",
                timezone: "America/Chicago",
                category: "Spa",
                bio: "Wellness and relaxation",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              {
                id: "4",
                name: "Team Delta",
                slug: "team-delta",
                location: "Houston",
                contactEmail: "delta@example.com",
                contactPhone: "+1234567893",
                timezone: "America/Chicago",
                category: "Fitness",
                bio: "Personal training team",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              {
                id: "5",
                name: "Team Epsilon",
                slug: "team-epsilon",
                location: "Miami",
                contactEmail: "epsilon@example.com",
                contactPhone: "+1234567894",
                timezone: "America/New_York",
                category: "Beauty",
                bio: "Beauty and aesthetics",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ]}
          />
        </Flex>
        <FullCalendar appointments={mockAppointments} />
      </Flex>
    </Container>
  );
}

export default DashboardPage;
