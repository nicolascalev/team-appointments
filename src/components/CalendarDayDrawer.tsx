"use client";
import { AppointmentFull, EventFull } from "@/lib/types";
import { Accordion, Drawer, Group, Stack, Text } from "@mantine/core";
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
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        "Events for " + moment(selectedDay).format("dddd, MMMM D, YYYY")
      }
      position="right"
    >
      <div>
        {appointments && (
        <Accordion
          styles={{
            control: {
              padding: "0px",
            },
            content: {
              padding: "0px",
              paddingBottom: "var(--mantine-spacing-md)",
            },
          }}
        >
          {appointments.map((appointment) => (
            <Accordion.Item key={appointment.id} value={appointment.id}>
              <Accordion.Control>
                <Group wrap="nowrap" gap="lg">
                  <div>
                    <Text size="xs" c="dimmed">
                      Time
                    </Text>
                    <Text size="sm">
                      {moment(appointment.start).format("h:mm A")}
                    </Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">
                      Team Member
                    </Text>
                    <Text size="sm">{appointment.teamMember.user.name}</Text>
                  </div>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="xs">
                  <div>
                    <Text size="xs" c="dimmed">
                      Team
                    </Text>
                    <Text size="sm">{appointment.team.name}</Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">
                      Service
                    </Text>
                    <Text size="sm">{appointment.service.name}</Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">
                      Client
                    </Text>
                    <Text size="sm">{appointment.clientName}</Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">
                      Status
                    </Text>
                    <Text size="sm" tt="capitalize">
                      {appointment.status.toLowerCase()}
                    </Text>
                  </div>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>)}
        {blockOffs && (
          <Stack>
            {blockOffs.map((blockOff) => (
              <div key={blockOff.id}>
                <Text size="sm">{blockOff.teamMember.user.name}</Text>
                <Text size="sm">{blockOff.reason}</Text>
                <Text size="sm">{moment(blockOff.start).format("h:mm A")} - {moment(blockOff.end).format("h:mm A")}</Text>
              </div>
            ))}
          </Stack>
        )}
      </div>
    </Drawer>
  );
}

export default CalendarDayDrawer;
