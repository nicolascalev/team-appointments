"use client";
import { AppointmentFull } from "@/lib/types";
import { Accordion, Drawer, Group, Stack, Text } from "@mantine/core";
import moment from "moment";

function CalendarDayDrawer({
  opened,
  onClose,
  appointments,
  selectedDay,
}: {
  opened: boolean;
  onClose: () => void;
  appointments?: AppointmentFull[];
  selectedDay?: Date;
}) {
  if (!appointments) return null;
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
        </Accordion>
      </div>
    </Drawer>
  );
}

export default CalendarDayDrawer;
