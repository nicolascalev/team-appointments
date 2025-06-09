"use client";

import { Button, Group, Popover, Text } from "@mantine/core";
import { useState } from "react";
import { cancelTeamInvite } from "@/actions/team";
import { showNotification } from "@mantine/notifications";

interface CancelInvitePopoverProps {
  inviteId: string;
  onSuccess?: () => void;
}

function CancelInvitePopover({
  inviteId,
  onSuccess,
}: CancelInvitePopoverProps) {
  const [opened, setOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const { error } = await cancelTeamInvite(inviteId);
      if (error) {
        showNotification({
          title: "Error",
          message: error,
          color: "red",
        });
        return;
      }

      showNotification({
        title: "Success",
        message: "Invite cancelled successfully",
        color: "teal",
      });
      setOpened(false);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "An unexpected error occurred",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      withArrow
      shadow="md"
      width={370}
    >
      <Popover.Target>
        <Button variant="default" onClick={() => setOpened(true)}>
          Cancel
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="sm" mb="md">
          Are you sure you want to cancel this invite?
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setOpened(false)}>
            No
          </Button>
          <Button color="red" onClick={handleCancel} loading={isLoading}>
            Yes
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
}

export default CancelInvitePopover;
