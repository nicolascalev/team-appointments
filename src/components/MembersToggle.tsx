"use client";

import { Avatar, Text, Flex, Group, Box } from "@mantine/core";
import { TeamMemberWithUser } from "@/lib/types";
import { useEffect, useState } from "react";
import { IconCheck } from "@tabler/icons-react";

function MembersToggle({
  members,
  defaultSelectedMembers,
  onChange,
}: {
  members: TeamMemberWithUser[];
  defaultSelectedMembers?: TeamMemberWithUser[];
  onChange?: (members: TeamMemberWithUser[]) => void;
}) {
  const [selectedMembers, setSelectedMembers] = useState<TeamMemberWithUser[]>(
    defaultSelectedMembers || []
  );

  const toggleMember = (member: TeamMemberWithUser) => {
    setSelectedMembers((prev) => {
      const isSelected = prev.some((m) => m.id === member.id);
      if (isSelected) {
        return prev.filter((m) => m.id !== member.id);
      } else {
        return [...prev, member];
      }
    });
  };

  useEffect(() => {
    onChange?.(selectedMembers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMembers]);

  return (
    <Group>
      {members.map((member) => (
        <Flex
          direction="column"
          gap="4"
          align="center"
          w={100}
          maw={100}
          key={member.id}
          style={{
            cursor: "pointer",
            position: "relative",
            padding: "4px",
            borderRadius: "8px",
          }}
          onClick={() => toggleMember(member)}
        >
          {selectedMembers.some((m) => m.id === member.id) && (
            <Box
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                backgroundColor: "var(--mantine-color-teal-6)",
                borderRadius: "50%",
                padding: "3px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconCheck size={14} color="white" />
            </Box>
          )}
          <Avatar
            src={member.user.avatarUrl || undefined}
            alt={member.user.name || ""}
          >
            {member.user.name?.charAt(0)}
          </Avatar>
          <Text fw={500} size="sm" truncate="end" ta="center" w={100} maw={100}>
            {member.user.name}
          </Text>
        </Flex>
      ))}
    </Group>
  );
}

export default MembersToggle;
