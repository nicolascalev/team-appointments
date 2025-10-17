"use client";
import { AppointmentFull, EventFull } from "@/lib/types";
import {
  Button,
  Collapse,
  Drawer,
  Group,
  Stack,
  Text,
  Badge,
  Divider,
  Card,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconChevronUp,
  IconCalendar,
  IconClock,
} from "@tabler/icons-react";
import moment from "moment";

function CalendarDayDrawer({
  opened,
  onClose,
  appointments,
  blockOffs,
  selectedDay,
}: {
  opened: boolean;
  onClose: () => void;
  appointments?: AppointmentFull[];
  blockOffs?: EventFull[];
  selectedDay?: Date;
}) {
  if (!appointments && !blockOffs) return null;

  // Group appointments and blockOffs by team
  const groupedData = groupByTeam(appointments || [], blockOffs || []);

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={"Events for " + moment(selectedDay).format("dddd, MMMM D, YYYY")}
      position="right"
    >
      <Stack>
        {Object.entries(groupedData).map(([teamId, teamData]) => (
          <TeamPanel
            key={teamId}
            teamName={teamData.teamName}
            appointments={teamData.appointments}
            blockOffs={teamData.blockOffs}
          />
        ))}
      </Stack>
    </Drawer>
  );
}

function groupByTeam(appointments: AppointmentFull[], blockOffs: EventFull[]) {
  const grouped: Record<
    string,
    {
      teamName: string;
      appointments: AppointmentFull[];
      blockOffs: EventFull[];
    }
  > = {};

  // Group appointments by team
  appointments.forEach((appointment) => {
    const teamId = appointment.team.id;
    if (!grouped[teamId]) {
      grouped[teamId] = {
        teamName: appointment.team.name,
        appointments: [],
        blockOffs: [],
      };
    }
    grouped[teamId].appointments.push(appointment);
  });

  // Group blockOffs by team
  blockOffs.forEach((blockOff) => {
    const teamId = blockOff.teamMember.team.id;
    if (!grouped[teamId]) {
      grouped[teamId] = {
        teamName: blockOff.teamMember.team.name,
        appointments: [],
        blockOffs: [],
      };
    }
    grouped[teamId].blockOffs.push(blockOff);
  });

  return grouped;
}

function TeamPanel({
  teamName,
  appointments,
  blockOffs,
}: {
  teamName: string;
  appointments: AppointmentFull[];
  blockOffs: EventFull[];
}) {
  const [opened, { toggle }] = useDisclosure(false);
  const totalEvents = appointments.length + blockOffs.length;

  return (
    <div>
      <Button
        variant="default"
        rightSection={
          opened ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />
        }
        onClick={toggle}
        w="100%"
        justify="space-between"
      >
        <Group gap="xs">
          <Text fw={500} size="sm">
            {teamName}
          </Text>
          <Badge size="sm" variant="light">
            {totalEvents} events
          </Badge>
        </Group>
      </Button>
      <Collapse in={opened}>
        <Stack gap="sm" pt="sm">
          {/* Appointments Section */}
          {appointments.length > 0 && (
            <>
              <Group gap="xs" justify="space-between">
                <IconCalendar size={16} />
                <Text fw={600} size="sm">
                  Appointments ({appointments.length})
                </Text>
              </Group>
              {appointments.map((appointment) => (
                <AppointmentItem
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
              {blockOffs.length > 0 && <Divider />}
            </>
          )}

          {/* Block Offs Section */}
          {blockOffs.length > 0 && (
            <>
              <Group gap="xs" justify="space-between">
                <IconClock size={16} />
                <Text fw={600} size="sm">
                  Blocks Off ({blockOffs.length})
                </Text>
              </Group>
              {blockOffs.map((blockOff) => (
                <BlockOffItem key={blockOff.id} blockOff={blockOff} />
              ))}
            </>
          )}
        </Stack>
      </Collapse>
    </div>
  );
}

function AppointmentItem({ appointment }: { appointment: AppointmentFull }) {
  return (
    <Card withBorder p="xs">
      <Group justify="space-between" mb="xs">
        <Text fw={500} size="sm">
          {appointment.service.name}
        </Text>
        <Badge size="xs" variant="light">
          {moment(appointment.start).format("h:mm A")} -{" "}
          {moment(appointment.end).format("h:mm A")}
        </Badge>
      </Group>
      <Text size="xs" c="dimmed">
        Client: {appointment.clientName}
      </Text>
      {appointment.teamMember && (
        <Text size="xs" c="dimmed">
          Staff: {appointment.teamMember.user.name}
        </Text>
      )}
      <Text size="xs" c="dimmed">
        Status:{" "}
        <span className="!capitalize">{appointment.status.toLowerCase()}</span>
      </Text>
    </Card>
  );
}

function BlockOffItem({ blockOff }: { blockOff: EventFull }) {
  return (
    <Card withBorder p="xs">
      <Group justify="space-between" mb="xs">
        <Text fw={500} size="sm">
          {blockOff.reason || "Block Off"}
        </Text>
      </Group>

      <Text size="xs" c="dimmed">
        From {moment(blockOff.start).format("dd, MMM D, YYYY h:mm A")}
      </Text>
      <Text size="xs" c="dimmed">
        To {moment(blockOff.end).format("dd, MMM D, YYYY h:mm A")}
      </Text>
      <Text size="xs" c="dimmed">
        Staff: {blockOff.teamMember.user.name}
      </Text>
    </Card>
  );
}

export default CalendarDayDrawer;
