"use client";

import { Button, Popover, Select, Stack } from "@mantine/core";
import { useState } from "react";
import { updateTeamInviteRole } from "@/actions/team";
import { showNotification } from "@mantine/notifications";
import { TeamRole } from "../../prisma/generated";

interface ChangeInviteRolePopoverProps {
  inviteId: string;
  currentRole: TeamRole;
  onSuccess?: () => void;
}

function ChangeInviteRolePopover({
  inviteId,
  currentRole,
  onSuccess,
}: ChangeInviteRolePopoverProps) {
  const [opened, setOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<TeamRole>(currentRole);

  const handleRoleChange = async (newRole: TeamRole) => {
    setIsLoading(true);
    try {
      const { error } = await updateTeamInviteRole(inviteId, newRole);
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
        message: "Role updated successfully",
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
      width={300}
    >
      <Popover.Target>
        <Button
          variant="default"
          onClick={() => setOpened(true)}
          loading={isLoading}
        >
          Change role
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          <Select
            label="Select role"
            value={role}
            onChange={(value) => {
              if (value) {
                setRole(value as TeamRole);
                handleRoleChange(value as TeamRole);
              }
            }}
            data={[
              ...Object.values(TeamRole).map((role) => ({
                value: role,
                label: role.charAt(0) + role.slice(1).toLowerCase(),
              })),
            ]}
            disabled={isLoading}
          />
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

export default ChangeInviteRolePopover;
