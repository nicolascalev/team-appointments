import { getAppointment } from "@/actions/appointment";
import {
  Anchor,
  Avatar,
  Button,
  Card,
  Container,
  Group,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconCheck, IconTrash } from "@tabler/icons-react";
import moment from "moment";
import { notFound } from "next/navigation";
import React from "react";

async function AppointmentConfirmationPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const appointmentId = (await params).appointmentId;
  const appointment = await getAppointment(appointmentId);

  if (!appointment) {
    notFound();
  }

  return (
    <Container size="sm" py="xl">
      <Stack>
        <Group justify="center">
          <ThemeIcon color="teal" size="xl" radius="xl">
            <IconCheck size={24} />
          </ThemeIcon>
        </Group>
        <Text ta="center" fw={500} size="lg">
          Appointment confirmed
        </Text>
        <Text ta="center" size="sm">
          You will receive an email confirmation shortly.
        </Text>
        <Text fw={500}>Your details</Text>
        <Card withBorder>
          <Stack>
            <div>
              <Text fw={500} size="sm">
                Name
              </Text>
              <Text size="sm">{appointment.clientName}</Text>
            </div>
            <div>
              <Text fw={500} size="sm">
                Email
              </Text>
              <Text size="sm">{appointment.clientEmail}</Text>
            </div>
          </Stack>
        </Card>
        <Text fw={500}>Service details</Text>
        <Card withBorder>
          <Stack>
            <Group>
              <Avatar src={appointment.team.avatarUrl}>
                {appointment.team.name.charAt(0)}
              </Avatar>
              <Anchor
                c="inherit"
                underline="hover"
                size="sm"
                href={`/${appointment.team.slug}`}
              >
                {appointment.team.name}
              </Anchor>
            </Group>
            <div>
              <Text fw={500} size="sm" mb="xs">
                Team member
              </Text>
              <Group>
                <Avatar src={appointment.teamMember.user.avatarUrl}>
                  {appointment.teamMember.user.name?.charAt(0)}
                </Avatar>
                <Text size="sm">{appointment.teamMember.user.name ?? "U"}</Text>
              </Group>
            </div>
            <div>
              <Text fw={500} size="sm">
                Service booked
              </Text>
              <Text size="sm">{appointment.service.name}</Text>
            </div>
            <div>
              <Text fw={500} size="sm">
                Date
              </Text>
              <Text size="sm">
                {moment(appointment.start).format("DD MMMM YYYY hh:mm a")}
              </Text>
            </div>
            <div>
              <Text fw={500} size="sm">
                Price
              </Text>
              <Text size="sm">
                {appointment.service.price} {appointment.service.currencyCode}
              </Text>
            </div>
          </Stack>
        </Card>
        <Text fw={500}>Cancellation policy</Text>
        <Card withBorder>
          <Stack>
            <Text size="sm">
              {appointment.team.settings?.cancellationPolicy ??
                "The cancellation policy is not set for this team."}
            </Text>
            <div>
              <Button
                color="red"
                variant="light"
                leftSection={<IconTrash size={14} />}
              >
                Cancel appointment
              </Button>
            </div>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}

export default AppointmentConfirmationPage;
