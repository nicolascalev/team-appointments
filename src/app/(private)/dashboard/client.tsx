"use client";

import FullCalendar from "@/components/FullCalendar";
import TeamsToggle from "@/components/TeamsToggle";
import { Container, Flex, Text } from "@mantine/core";
import { Team } from "../../../../prisma/generated";
import { useState } from "react";

function DashboardClient({ teams }: { teams: Team[] }) {
  const [selectedTeams, setSelectedTeams] = useState<Team[]>(teams);

return (
  <Container mx={{ base: "-md", sm: "auto" }} p={{ base: "md", sm: 0 }}>
    <Flex direction="column" gap="xl">
      <Flex direction="column" gap="md">
        <div>
          <Text fw={500}>Calendars</Text>
          <Text c="dimmed" size="sm">
            Show your appointments for the selected teams
          </Text>
        </div>
        <TeamsToggle teams={teams} initialSelectedTeams={teams} onChange={setSelectedTeams} />
      </Flex>
      <FullCalendar selectedTeams={selectedTeams} />
    </Flex>
  </Container>
  )
}

export default DashboardClient;
