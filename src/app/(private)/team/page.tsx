import { getUserTeamPageData } from "@/actions/user";
import CreateTeamDrawer from "@/components/CreateTeamDrawer";
import MemberUpdateBioForm from "@/components/MemberUpdateBioForm";
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
} from "@mantine/core";
import { getCurrentUser } from "@/actions/auth";
import { formatDateLong } from "@/lib/utils";

async function TeamPage() {
  const user = await getCurrentUser();
  const { data, error } = await getUserTeamPageData();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  if (error || !data) {
    return <div>{error}</div>;
  }

  const currentTeamMember = data.currentSessionTeam?.members.find(
    (member) => member.userId === user.id
  );

  const userIsOnSchedule =
    currentTeamMember?.isActive &&
    currentTeamMember?.isSchedulable &&
    currentTeamMember?.availability.length > 0;

  return (
    <Container size="md" p={0}>
      <Text fw={500} my="xl" size="lg">
        Team Settings
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <div>
          <Text fw={500}>Active team</Text>
          <Text c="dimmed" mb="md">
            Select the team you want to see
          </Text>
          <CreateTeamDrawer />
        </div>
        <div className="flex flex-col gap-4">
          <TeamSelect
            teams={data.teams}
            currentTeam={data.currentSessionTeam}
          />
          {currentTeamMember && (
            <MemberUpdateBioForm member={currentTeamMember} />
          )}
        </div>
      </SimpleGrid>
      <Divider my="xl" />
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <div>
          <Text fw={500}>Your availability with the current team</Text>
          <Text c="dimmed">These are the times you are scheduled to work</Text>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <Text fw={500}>Your schedule</Text>
            {userIsOnSchedule ? (
              <>
                {currentTeamMember?.availability.map((availability) => (
                  <Text key={availability.id} c="dimmed">
                    {new Intl.DateTimeFormat("en-US", {
                      weekday: "long",
                    }).format(new Date(2024, 0, availability.dayOfWeek))}
                    : {availability.startTime} - {availability.endTime}
                  </Text>
                ))}
              </>
            ) : (
              <Text c="dimmed">You are not on schedule</Text>
            )}
          </div>
          <div>
            <Text fw={500}>Upcoming blocks off</Text>
            {currentTeamMember?.blockOffs.length &&
            currentTeamMember?.blockOffs.length > 0 ? (
              <>
                {currentTeamMember?.blockOffs.map((blockOff) => (
                  <Text key={blockOff.id} c="dimmed">
                    {formatDateLong(new Date(blockOff.start))} -{" "}
                    {formatDateLong(new Date(blockOff.end))}
                  </Text>
                ))}
              </>
            ) : (
              <Text c="dimmed">No upcoming blocks off</Text>
            )}
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
          {data.teams.map((team) => (
            <Group key={team.id}>
              <Avatar color="teal" src={team.avatarUrl}>
                {team.name.charAt(0)}
              </Avatar>
              <Text>{team.name}</Text>
              <Badge color="gray" variant="light" radius="xs" className="">
                {team.members.find((member) => member.userId === user.id)?.role}
              </Badge>
            </Group>
          ))}
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
