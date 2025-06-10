"use client";
import {
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Avatar,
  Select,
  Button,
  Divider,
  Checkbox,
  Card,
} from "@mantine/core";
import { TeamRole } from "../../prisma/generated";
import BusinessHours from "./BusinessHours";
import { IconPlus } from "@tabler/icons-react";

function EditTeamMemberForm({ closeModal, teamMemberId }: { closeModal: () => void, teamMemberId: string }) {
  console.log(teamMemberId);

  return (
    <Container>
      <Group mb="md">
        <Avatar>U</Avatar>
        <div>
          <Text fw={500}>John Doe</Text>
          <Text c="dimmed">john.doe@example.com</Text>
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
          />
          <Select
            label="Role"
            data={[
              ...Object.values(TeamRole).map((role) => ({
                label: role.charAt(0) + role.slice(1).toLowerCase(),
                value: role,
              })),
            ]}
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
          />
          <BusinessHours
            businessHours={[]}
            onBusinessHoursChange={() => {}}
            label={
              <div>
                <Text fw={500} size="sm" mb="sm">
                  Schedule
                </Text>
                <Button variant="default" size="xs" mb="md">
                  Set the same as team business hours
                </Button>
              </div>
            }
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
          <Card withBorder>
            <Text size="sm">From June 10th to June 12th</Text>
            <Text size="sm">Reason: Vacation</Text>
          </Card>
          <div>
            <Button
              variant="default"
              size="xs"
              leftSection={<IconPlus size={14} />}
            >
              Add block off
            </Button>
          </div>
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
          <Card withBorder>
            <Checkbox label="" mb="xs" />
            <Text size="sm" fw={500}>
              Haircut
            </Text>
            <Text size="sm" c="dimmed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quos.
            </Text>
          </Card>
        </Stack>
      </SimpleGrid>
      <Group justify="flex-end" mt="xl">
        <Button variant="default" onClick={closeModal}>
          Cancel
        </Button>
        <Button onClick={closeModal}>Save</Button>
      </Group>
    </Container>
  );
}

export default EditTeamMemberForm;
