"use client";

import {
  Container,
  Stack,
  Text,
  SimpleGrid,
  Divider,
  ActionIcon,
  Group,
  Card,
  Drawer,
  Avatar,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { AdminDashboardStats } from "@/lib/types";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { User } from "../../../../../prisma/generated";
import FullCalendarAdmin from "@/components/FullCalendarAdmin";

interface AdminDashboardClientProps {
  stats: AdminDashboardStats;
}

function AdminDashboardClient({ stats }: AdminDashboardClientProps) {
  const [
    membersDrawerOpened,
    { open: openMembersDrawer, close: closeMembersDrawer },
  ] = useDisclosure(false);
  const [membersDrawerTitle, setMembersDrawerTitle] = useState("Members");
  const [drawerMembers, setDrawerMembers] = useState<User[]>([]);

  function activeMembersDrawer() {
    setMembersDrawerTitle("Active members");
    setDrawerMembers(stats.activeMembers.map((member) => member.user as User));
    openMembersDrawer();
  }

  function membersWithUpcomingAvailabilityDrawer() {
    setMembersDrawerTitle("Members with upcoming availability");
    setDrawerMembers(stats.membersWithUpcomingAvailability.map((member) => member.user as User));
    openMembersDrawer();
  }

  function membersOnScheduleTodayDrawer() {
    setMembersDrawerTitle("Members on schedule today");
    setDrawerMembers(stats.membersOnScheduleToday.map((member) => member.user as User));
    openMembersDrawer();
  }

  function staffOffWorkTodayDrawer() {
    setMembersDrawerTitle("Staff off work today");
    setDrawerMembers(stats.staffOffWorkToday.map((member) => member.user as User));
    openMembersDrawer();
  }

  return (
    <Container mx={{ base: "-md", sm: "auto" }} p={{ base: "md", sm: 0 }}>
      <Stack pb="xl">
        <div>
          <Text fw={500} mt="xl">
            Admin Dashboard
          </Text>
          <Text c="dimmed" size="sm">
            Manage your team and your appointments
          </Text>
        </div>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
          <StatCard
            title="Total appointments this month"
            value={stats.totalAppointmentsThisMonth}
          />
          <StatCard
            title="Today's appointments"
            value={stats.todaysAppointments}
          />
          <StatCard
            title={`Upcoming appointments\n(Next 7 days)`}
            value={stats.upcomingAppointments}
          />
          <StatCard
            title="Cancelled this month"
            value={stats.cancelledThisMonth}
          />
        </SimpleGrid>
        <div>
          <Text fw={500} mt="xl">
            Team overview
          </Text>
          <Text c="dimmed" size="sm">
            Overview of the team&apos;s appointments and cancellations
          </Text>
        </div>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
          <StatCard
            title="Active team members count"
            value={stats.activeMembers.length}
            onClick={
              stats.activeMembers.length > 0 ? activeMembersDrawer : undefined
            }
          />
          <StatCard
            title="Members with upcoming availability"
            value={stats.membersWithUpcomingAvailability.length}
            onClick={
              stats.membersWithUpcomingAvailability.length > 0
                ? membersWithUpcomingAvailabilityDrawer
                : undefined
            }
          />
          <StatCard
            title="Members on schedule today"
            value={stats.membersOnScheduleToday.length}
            onClick={
              stats.membersOnScheduleToday.length > 0
                ? membersOnScheduleTodayDrawer
                : undefined
            }
          />
          <StatCard
            title="Staff off work today"
            value={stats.staffOffWorkToday.length}
            onClick={
              stats.staffOffWorkToday.length > 0
                ? staffOffWorkTodayDrawer
                : undefined
            }
          />
        </SimpleGrid>
        <Divider my="xl" />
        <div>
          <Text fw={500}>Calendar</Text>
          <Text c="dimmed" size="sm">
            View the calendar for the selected members
          </Text>
        </div>
        <FullCalendarAdmin members={stats.allTeamMembers} />
      </Stack>
      <Drawer
        opened={membersDrawerOpened}
        onClose={closeMembersDrawer}
        title={membersDrawerTitle}
        position="right"
      >
        {drawerMembers.length > 0 ? (
          <Stack>
            {drawerMembers.map((member, index) => (
              <>
                <Group key={index}>
                  <Avatar src={member.avatarUrl} />
                  <Text key={member.id}>{member.name}</Text>
                </Group>
                {index < drawerMembers.length - 1 && <Divider />}
              </>
            ))}
          </Stack>
        ) : (
          <Text>No members found</Text>
        )}
      </Drawer>
    </Container>
  );
}

export default AdminDashboardClient;

function StatCard({
  title,
  value,
  onClick,
}: {
  title: string;
  value: number;
  onClick?: () => void;
}) {
  return (
    <Card withBorder p="sm">
      <Stack justify="space-between" h="100%">
        <Text size="sm" className="whitespace-pre-line">
          {title}
        </Text>
        <Group gap="xs">
          <Text size="xl" fw={600}>
            {value}
          </Text>
          {onClick && (
            <ActionIcon variant="light" size="sm" onClick={onClick}>
              <IconArrowRight size={16} />
            </ActionIcon>
          )}
        </Group>
      </Stack>
    </Card>
  );
}
