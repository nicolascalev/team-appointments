"use client";

import { Avatar, Button, Group, Popover, Text } from "@mantine/core";
import { formatDistanceToNow } from "date-fns";
import { InviteWithTeam } from "@/lib/types";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { acceptInvite, rejectInvite } from "@/actions/user";

function UserInvite({ invite }: { invite: InviteWithTeam }) {
  const [acceptPopoverOpened, setAcceptPopoverOpened] = useState(false);
  const [rejectPopoverOpened, setRejectPopoverOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      const { error } = await acceptInvite(invite.id);
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
        message: `You have joined ${invite.team.name}`,
        color: "teal",
      });
      setAcceptPopoverOpened(false);
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

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const { error } = await rejectInvite(invite.id);
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
        message: "Invite rejected successfully",
        color: "teal",
      });
      setRejectPopoverOpened(false);
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
    <Group align="flex-start" wrap="nowrap">
      <Avatar color="indigo" src={invite.team.avatarUrl}>
        {invite.team.name.charAt(0)}
      </Avatar>
      <div className="flex flex-col gap-2 grow">
        <Text>{invite.team.name}</Text>
        <Text c="dimmed" size="sm">
          You have been invited to join {invite.team.name} as an {invite.role}.
        </Text>
        <Text c="dimmed" size="sm">
          Expires in{" "}
          {formatDistanceToNow(new Date(invite.expiresAt), {
            addSuffix: false,
          })}
        </Text>
        <Group justify="flex-end">
          <Popover
            opened={acceptPopoverOpened}
            onChange={setAcceptPopoverOpened}
            withArrow
            shadow="md"
            width={300}
          >
            <Popover.Target>
              <Button
                variant="default"
                onClick={() => setAcceptPopoverOpened(true)}
              >
                Accept
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="sm" mb="md">
                Are you sure you want to join {invite.team.name}?
              </Text>
              <Group justify="flex-end">
                <Button
                  variant="default"
                  onClick={() => setAcceptPopoverOpened(false)}
                >
                  No
                </Button>
                <Button color="indigo" onClick={handleAccept} loading={isLoading}>
                  Yes
                </Button>
              </Group>
            </Popover.Dropdown>
          </Popover>

          <Popover
            opened={rejectPopoverOpened}
            onChange={setRejectPopoverOpened}
            withArrow
            shadow="md"
            width={300}
          >
            <Popover.Target>
              <Button
                variant="default"
                onClick={() => setRejectPopoverOpened(true)}
              >
                Reject
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="sm" mb="md">
                Are you sure you want to reject this invite?
              </Text>
              <Group justify="flex-end">
                <Button
                  variant="default"
                  onClick={() => setRejectPopoverOpened(false)}
                >
                  No
                </Button>
                <Button color="red" onClick={handleReject} loading={isLoading}>
                  Yes
                </Button>
              </Group>
            </Popover.Dropdown>
          </Popover>
        </Group>
      </div>
    </Group>
  );
}

export default UserInvite;
