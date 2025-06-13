"use client";
import React, { useState } from "react";
import { Group, Select, SelectProps, Avatar } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { Team } from "../../prisma/generated";
import { updateUserCurrentSessionTeam } from "@/actions/user";
import { showNotification } from "@mantine/notifications";

const iconProps = {
  size: 14,
};

interface TeamSelectProps {
  teams: Team[];
  currentTeam?: Team | null;
}

function TeamSelect({ teams, currentTeam }: TeamSelectProps) {
  const [loading, setLoading] = useState(false);

  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    ...others
  }) => {
    const team = teams.find((t: Team) => t.id === option.value);

    return (
      <Group flex="1" gap="xs">
        <Avatar size="sm" radius="xl" src={team?.avatarUrl}>
          {team?.name.charAt(0)}
        </Avatar>
        {option.label}
        {others.checked && (
          <IconCheck style={{ marginInlineStart: "auto" }} {...iconProps} />
        )}
      </Group>
    );
  };

  const teamOptions = teams.map((team) => ({
    value: team.id,
    label: team.name,
  }));

  const handleTeamChange = async (teamId: string | null) => {
    if (!teamId) return;

    setLoading(true);
    try {
      const { error } = await updateUserCurrentSessionTeam(teamId);

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
        message: "Team updated successfully",
        color: "green",
      });
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "Failed to update team",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select
      label="Select Team"
      placeholder="Choose a team"
      data={teamOptions}
      value={currentTeam?.id}
      onChange={handleTeamChange}
      renderOption={renderSelectOption}
      disabled={loading}
    />
  );
}

export default TeamSelect;
