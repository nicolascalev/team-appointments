"use client";

import { Avatar, Text, Flex, Group, Box } from "@mantine/core";
import { useState } from "react";
import { IconCheck } from "@tabler/icons-react";
import type { Team } from "../../prisma/generated";

function TeamsToggle({ teams }: { teams: Team[] }) {
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);

  const toggleTeam = (team: Team) => {
    setSelectedTeams((prev) => {
      const isSelected = prev.some((t) => t.id === team.id);
      if (isSelected) {
        return prev.filter((t) => t.id !== team.id);
      } else {
        return [...prev, team];
      }
    });
  };

  return (
    <Group>
      {teams.map((team) => (
        <Flex
          direction="column"
          gap="4"
          align="center"
          w={100}
          maw={100}
          key={team.id}
          style={{
            cursor: "pointer",
            position: "relative",
            padding: "4px",
            borderRadius: "8px",
          }}
          onClick={() => toggleTeam(team)}
        >
          {selectedTeams.some((t) => t.id === team.id) && (
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
          <Avatar>{team.name.charAt(0)}</Avatar>
          <Text fw={500} size="sm" truncate="end" ta="center" w={100} maw={100}>
            {team.name}
          </Text>
        </Flex>
      ))}
    </Group>
  );
}

export default TeamsToggle;
