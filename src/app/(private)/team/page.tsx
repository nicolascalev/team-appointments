import TeamSelect from "@/components/TeamSelect";
import {
  Avatar,
  Badge,
  Button,
  Container,
  Divider,
  Group,
  SimpleGrid,
  Text,
  Textarea,
} from "@mantine/core";
import React from "react";

async function TeamPage() {
  return (
    <Container size="md" p={0}>
      <Text fw={500} my="xl" size="lg">
        Team Settings
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <div>
          <Text fw={500}>Active team</Text>
          <Text c="dimmed">Select the team you want to see</Text>
        </div>
        <div className="flex flex-col gap-4">
          <TeamSelect />
          <form className="flex flex-col gap-4">
            <Textarea
              label="Bio"
              description="Short bio of your role in the team"
              placeholder="For example: Full-time barber, nail specialist..."
              name="bio"
              minRows={2}
              autosize
            />
            <Group justify="flex-end">
              <Button type="submit">Save</Button>
            </Group>
          </form>
        </div>
      </SimpleGrid>
      <Divider my="xl" />
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <div>
          <Text fw={500}>Your availability</Text>
          <Text c="dimmed">These are the times you are scheduled to work</Text>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <Text fw={500}>Your schedule</Text>
            <Text c="dimmed">Mondays: 10:00 - 18:00</Text>
            <Text c="dimmed">Tuesdays: 10:00 - 18:00</Text>
            <Text c="dimmed">Wednesdays: 10:00 - 18:00</Text>
            <Text c="dimmed">Thursdays: 10:00 - 18:00</Text>
          </div>
          <div>
            <Text fw={500}>Upcoming blocks off</Text>
            <Text c="dimmed">No upcoming blocks off</Text>
          </div>
        </div>
      </SimpleGrid>
      <Divider my="xl" />
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <div>
          <Text fw={500}>Your teams</Text>
          <Text c="dimmed">This are the teams you are a member of</Text>
        </div>
        <div className="flex flex-col gap-4">
          <Group>
            <Avatar color="teal">TA</Avatar>
            <Text>Team Alpha</Text>
            <Badge color="gray" variant="light" radius="xs" className="">
              Admin
            </Badge>
          </Group>
          <Group>
            <Avatar color="teal">TA</Avatar>
            <Text>Team Alpha</Text>
            <Badge color="gray" variant="light" radius="xs" className="">
              Admin
            </Badge>
          </Group>
        </div>
      </SimpleGrid>
      <Divider my="xl" />
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <div>
          <Text fw={500}>Team invitations</Text>
          <Text c="dimmed">
            This are the team invitations you have received
          </Text>
        </div>
        <div className="flex flex-col gap-4">
          <Group align="flex-start" wrap="nowrap">
            <Avatar color="teal">TA</Avatar>
            <div className="flex flex-col gap-2 grow">
              <Text>Team invitation 1</Text>
              <Text c="dimmed" size="sm">
                You have been invited to join Team Alpha as an Admin.
              </Text>
              <Text c="dimmed" size="sm">
                Expires in 1 day
              </Text>
              <Group justify="flex-end">
                <Button variant="default">Accept</Button>
                <Button variant="default">Reject</Button>
              </Group>
            </div>
          </Group>
          <Group align="flex-start" wrap="nowrap">
            <Avatar color="teal">TA</Avatar>
            <div className="flex flex-col gap-2 grow">
              <Text>Team invitation 1</Text>
              <Text c="dimmed" size="sm">
                You have been invited to join Team Alpha as an Admin.
              </Text>
              <Text c="dimmed" size="sm">
                Expires in 1 day
              </Text>
              <Group justify="flex-end">
                <Button variant="default">Accept</Button>
                <Button variant="default">Reject</Button>
              </Group>
            </div>
          </Group>
        </div>
      </SimpleGrid>
    </Container>
  );
}

export default TeamPage;
