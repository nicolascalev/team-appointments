"use client";
import { AvailabilityInput, BlockOff, TeamMemberFull } from "@/lib/types";
import { useMember } from "@/lib/useMember";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Container,
  Divider,
  Group,
  Loader,
  Popover,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { Service, TeamRole } from "../../prisma/generated";
import Availability from "./Availability";
import BlockOffsForm from "./BlockOffsForm";
import { deleteBlockOff, updateTeamMember } from "@/actions/member";
import { tryCatch } from "@/lib/try-catch";
import { showNotification } from "@mantine/notifications";
import { formatDateLong } from "@/lib/utils";
import { ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

function EditTeamMemberForm({
  closeModal,
  teamMemberId,
}: {
  closeModal: () => void;
  teamMemberId: string;
}) {
  const { member, memberLoading, memberError, revalidateMember } =
    useMember(teamMemberId);

  if (memberLoading) {
    return (
      <Group wrap="nowrap">
        <Loader size="sm" />
        <Text size="sm">Loading team member...</Text>
      </Group>
    );
  }

  if (memberError) {
    return <div>Error: {memberError.message}</div>;
  }

  if (!member) {
    return <div>No member found</div>;
  }

  return (
    <EditTeamMemberFormContent
      member={member}
      closeModal={closeModal}
      revalidateMember={revalidateMember}
    />
  );
}

export default EditTeamMemberForm;

function EditTeamMemberFormContent({
  member,
  closeModal,
  revalidateMember,
}: {
  member: TeamMemberFull;
  closeModal: () => void;
  revalidateMember: () => void;
}) {
  const [active, setActive] = useState(member.isActive ? "active" : "inactive");
  const [role, setRole] = useState(member.role);
  const [isSchedulable, setIsSchedulable] = useState(
    member.isSchedulable ? "yes" : "no"
  );
  const [availability, setAvailability] = useState(
    member.availability as AvailabilityInput[]
  );
  const [blockOffsData, setBlockOffsData] = useState<BlockOff[]>(
    member.blockOffs.map((b) => ({
      start: new Date(b.start).toISOString(),
      end: new Date(b.end).toISOString(),
      reason: b.reason || "",
    }))
  );
  const [services, setServices] = useState<Service[]>(member.services);

  const [updateLoading, setUpdateLoading] = useState(false);

  async function handleUpdate() {
    setUpdateLoading(true);
    const formData = {
      isActive: active === "active",
      role,
      isSchedulable: isSchedulable === "yes",
      availability,
      blockOffs: [...blockOffsData],
      services: services,
    };
    const { data: updateData, error: updateError } = await tryCatch(
      updateTeamMember(member.id, formData)
    );
    if (updateError || updateData?.error) {
      showNotification({
        title: "Error",
        message:
          updateError?.message || updateData?.error || "Something went wrong",
        color: "red",
        withCloseButton: true,
      });
    } else {
      showNotification({
        title: "Success",
        message: "Team member updated successfully",
        color: "green",
        withCloseButton: true,
      });
      revalidateMember();
      closeModal();
    }
  }

  return (
    <Container>
      <Group mb="md">
        <Avatar src={member.user.avatarUrl}>
          {member.user.name?.charAt(0) || "U"}
        </Avatar>
        <div>
          <Text fw={500}>{member.user.name}</Text>
          <Text c="dimmed">{member.user.email}</Text>
        </div>
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <div>
          <Text fw={500}>General</Text>
          <Text c="dimmed">Manage team member general information</Text>
        </div>
        <Stack>
          <Select
            label="Active"
            data={[
              {
                label: "Active",
                value: "active",
              },
              {
                label: "Inactive",
                value: "inactive",
              },
            ]}
            value={active}
            onChange={(value) => setActive(value as "active" | "inactive")}
          />
          <Select
            label="Role"
            data={[
              ...Object.values(TeamRole).map((role) => ({
                label: role.charAt(0) + role.slice(1).toLowerCase(),
                value: role,
              })),
            ]}
            value={role}
            onChange={(value) => setRole(value as TeamRole)}
          />
        </Stack>
      </SimpleGrid>
      <Divider my="xl" />
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <div>
          <Text fw={500}>Schedule</Text>
          <Text c="dimmed">This are the schedule for the team member</Text>
        </div>
        <Stack>
          <Select
            label="Is schedulable"
            data={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
            value={isSchedulable}
            onChange={(value) => setIsSchedulable(value as "yes" | "no")}
          />
          <Availability
            availability={member.availability}
            onAvailabilityChange={setAvailability}
            businessHours={member.team.businessHours}
          />
        </Stack>
      </SimpleGrid>
      <Divider my="xl" />
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <div>
          <Text fw={500}>Blocks off</Text>
          <Text c="dimmed">
            This are the upcoming blocks off for the team member
          </Text>
        </div>
        <Stack>
          {member.blockOffs.length === 0 && (
            <Text size="sm" c="dimmed">
              No upcoming block offs
            </Text>
          )}
          {member.blockOffs.map((blockOff) => (
            <Card withBorder key={blockOff.id}>
              <Group justify="end">
                <DeleteBlockOffButton
                  blockOffId={blockOff.id}
                  revalidateMember={revalidateMember}
                />
              </Group>
              <Text size="sm">
                From {formatDateLong(new Date(blockOff.start))} <br />
                To {formatDateLong(new Date(blockOff.end))}
              </Text>
              <Text size="sm">Reason: {blockOff.reason}</Text>
            </Card>
          ))}
          <BlockOffsForm onChange={setBlockOffsData} />
        </Stack>
      </SimpleGrid>
      <Divider my="xl" />
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <div>
          <Text fw={500}>Assigned services</Text>
          <Text c="dimmed">
            This are the services assigned to the team member
          </Text>
        </div>
        <Stack>
          {member.team.services.map((service) => (
            <Card withBorder key={service.id}>
              <Checkbox
                label=""
                mb="xs"
                checked={services.some((s) => s.id === service.id)}
                onChange={() =>
                  setServices(
                    services.some((s) => s.id === service.id)
                      ? services.filter((s) => s.id !== service.id)
                      : [...services, service]
                  )
                }
              />
              <Text size="sm" fw={500}>
                {service.name}
              </Text>
              <Text size="sm" c="dimmed">
                {service.description}
              </Text>
            </Card>
          ))}
        </Stack>
      </SimpleGrid>
      <div className="sticky bottom-0 bg-[var(--mantine-color-body)]">
        <Divider mt="xl" />
        <Group justify="flex-end" py="md">
          <Button variant="default" onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} loading={updateLoading}>
            Save
          </Button>
        </Group>
      </div>
    </Container>
  );
}

function DeleteBlockOffButton({
  blockOffId,
  revalidateMember,
}: {
  blockOffId: string;
  revalidateMember: () => void;
}) {
  const [opened, setOpened] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  return (
    <Popover
      position="bottom-end"
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <ActionIcon
          variant="light"
          size="sm"
          color="red"
          onClick={() => setOpened(true)}
          loading={deleteLoading}
        >
          <IconTrash size={14} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown w={200}>
        <Stack>
          <Text size="sm">Are you sure you want to delete this block off?</Text>
          <Group justify="flex-end">
            <Button
              variant="default"
              size="xs"
              onClick={() => setOpened(false)}
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              color="red"
              size="xs"
              disabled={deleteLoading}
              onClick={async () => {
                setDeleteLoading(true);
                const { data: deletedBlockOff, error: deleteError } =
                  await tryCatch(deleteBlockOff(blockOffId));
                if (deleteError || deletedBlockOff?.error) {
                  showNotification({
                    title: "Error",
                    message:
                      deleteError?.message ||
                      deletedBlockOff?.error ||
                      "Something went wrong",
                    color: "red",
                    withCloseButton: true,
                  });
                } else {
                  showNotification({
                    title: "Success",
                    message: "Block off deleted successfully",
                    color: "green",
                    withCloseButton: true,
                  });
                  revalidateMember();
                  setOpened(false);
                }
                setDeleteLoading(false);
              }}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
