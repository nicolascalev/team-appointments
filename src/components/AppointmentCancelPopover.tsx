"use client";

import { cancelAppointment } from "@/actions/appointment";
import { Button, Group, Popover, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { AppointmentStatus } from "../../prisma/generated";

function AppointmentCancelPopover({
  appointmentId,
  disabled,
  appointmentStatus,
}: {
  appointmentId: string;
  disabled?: boolean;
  appointmentStatus: AppointmentStatus;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelAppointment = async () => {
    setIsLoading(true);
    const { error } = await cancelAppointment(appointmentId);
    if (error) {
      showNotification({
        title: "Error",
        message: error instanceof Error ? error.message : error,
        color: "red",
      });
    } else {
      showNotification({
        title: "Success",
        message: "Appointment cancelled successfully",
        color: "green",
      });
    }
    setIsLoading(false);
  };
  return (
    <Popover width={250} withArrow shadow="md" position="top-start">
      <Popover.Target>
        <Button
          color="red"
          variant="light"
          leftSection={<IconTrash size={14} />}
          loading={isLoading}
          disabled={
            disabled || appointmentStatus === AppointmentStatus.CANCELLED
          }
        >
          Cancel appointment
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="xs" mb="xs">
          Are you sure you want to cancel this appointment?
        </Text>
        <Group justify="flex-end" gap="xs">
          <Button
            color="red"
            size="xs"
            onClick={handleCancelAppointment}
            disabled={
              isLoading || appointmentStatus === AppointmentStatus.CANCELLED
            }
          >
            Confirm
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
}

export default AppointmentCancelPopover;
