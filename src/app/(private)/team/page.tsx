import { getUserTeamPageData } from "@/actions/user";
import CreateTeamDrawer from "@/components/CreateTeamDrawer";
import MemberUpdateBioForm from "@/components/MemberUpdateBioForm";
import TeamSelect from "@/components/TeamSelect";
import {
  Avatar,
  Badge,
  Container,
  Divider,
  Group,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { getCurrentUser } from "@/actions/auth";
import { formatDateLong } from "@/lib/utils";
import UserInvite from "@/components/UserInvite";

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
          {data.teams.length > 0 ? (
            <TeamSelect
              teams={data.teams}
              currentTeam={data.currentSessionTeam}
            />
          ) : (
            <Text c="dimmed">
              No teams found. Create a team or check your invites to join a
              team.
            </Text>
          )}
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
          {data.teams.length > 0 ? (
            <>
              {data.teams.map((team) => (
                <Group key={team.id}>
                  <Avatar color="teal" src={team.avatarUrl}>
                    {team.name.charAt(0)}
                  </Avatar>
                  <Text>{team.name}</Text>
                  <Badge color="gray" variant="light" radius="xs" className="">
                    {
                      team.members.find((member) => member.userId === user.id)
                        ?.role
                    }
                  </Badge>
                </Group>
              ))}
            </>
          ) : (
            <Text c="dimmed">
              No teams found. Create a team or check your invites to join a
              team.
            </Text>
          )}
        </div>
      </SimpleGrid>
      <Divider my="xl" />
      <SimpleGrid cols={{ base: 1, sm: 2 }} mb="xl">
        <div>
          <Text fw={500}>Team invitations</Text>
          <Text c="dimmed">
            This are the team invitations you have received
          </Text>
        </div>
        <div className="flex flex-col gap-4">
          {data.invites.length > 0 ? (
            <>
              {data.invites.map((invite) => (
                <UserInvite key={invite.id} invite={invite} />
              ))}
            </>
          ) : (
            <Text c="dimmed">No team invitations found</Text>
          )}
        </div>
      </SimpleGrid>
    </Container>
  );
}

export default TeamPage;
