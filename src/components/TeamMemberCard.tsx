import { TeamMemberCard as TeamMemberCardType } from "@/lib/types";
import { Avatar, Box, Card, Group, Text } from "@mantine/core";
import LabelWithInfo from "./LabelWithInfo";
import EditTeamMemberModal from "./EditTeamMemberModal";
import { formatDateLong } from "@/lib/utils";

function TeamMemberCard({ member }: { member: TeamMemberCardType }) {
  return (
    <Card withBorder>
      <Group justify="space-between">
        <div>
          <Text>{member.user.name}</Text>
          <Text c="dimmed">{member.bio}</Text>
        </div>
        <Avatar src={member.user.avatarUrl}>
          {member.user.name?.[0]?.toUpperCase()}
        </Avatar>
      </Group>
      <Group mt="md" wrap="nowrap">
        <div className="w-1/3">
          <LabelWithInfo
            label="Active"
            info="You can use this to quickly disable a user from taking appointments"
          />
          <Text size="sm" c="dimmed">
            {member.isActive ? "Yes" : "No"}
          </Text>
        </div>
        <div className="w-1/3">
          <LabelWithInfo
            label="Schedulable"
            info="Schedulable means that the user is an employee available to take appointments, not just a team member"
          />
          <Text size="sm" c="dimmed">
            {member.isSchedulable ? "Yes" : "No"}
          </Text>
        </div>
      </Group>
      <Box mt="md">
        <Text size="sm" fw={500}>
          Schedule
        </Text>
        {member.availability.length > 0 ? (
          <div>
            {member.availability.map((availability) => (
              <Text key={availability.id} size="sm" c="dimmed">
                {new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
                  new Date(2024, 0, availability.dayOfWeek)
                )}
                : {availability.startTime} - {availability.endTime}
              </Text>
            ))}
          </div>
        ) : (
          <Text size="sm" c="dimmed">
            No schedule available
          </Text>
        )}
      </Box>
      <Box mt="md">
        <LabelWithInfo
          label="Block offs"
          info="Upcoming blocks of time off for the employee"
        />
        {member.blockOffs.length > 0 ? (
          <div>
            {member.blockOffs.map((blockOff) => (
              <Text key={blockOff.id} size="sm" c="dimmed">
                {formatDateLong(new Date(blockOff.start))} -{" "}
                {formatDateLong(new Date(blockOff.end))}
              </Text>
            ))}
          </div>
        ) : (
          <Text size="sm" c="dimmed">
            No block offs
          </Text>
        )}
      </Box>
      <Box mt="md">
        <Text size="sm" fw={500}>
          Assigned services
        </Text>
        {member._count.services > 0 ? (
          <Text size="sm" c="dimmed">
            {member._count.services} services assigned
          </Text>
        ) : (
          <Text size="sm" c="dimmed">
            No services assigned
          </Text>
        )}
      </Box>
      <Box mt="md">
        <Text size="sm" fw={500}>
          Role
        </Text>
        <Text size="sm" c="dimmed">
          {member.role}
        </Text>
      </Box>
      <Group justify="flex-end" mt="md">
        <EditTeamMemberModal teamMemberId={member.id} />
      </Group>
    </Card>
  );
}

export default TeamMemberCard;
