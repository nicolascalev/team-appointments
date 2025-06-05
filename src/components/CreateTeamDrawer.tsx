"use client";

import { Button, Drawer } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import TeamForm from "./TeamForm";

interface CreateTeamDrawerProps {
  trigger?: React.ReactNode;
}

export default function CreateTeamDrawer({ trigger }: CreateTeamDrawerProps) {
  const [opened, setOpened] = useState(false);

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpened(true)}>{trigger}</div>
      ) : (
        <Button
          variant="default"
          size="sm"
          leftSection={<IconPlus size={14} />}
          onClick={() => setOpened(true)}
        >
          Create team
        </Button>
      )}

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Create New Team"
        size="md"
        position="right"
      >
        <TeamForm 
          mode="create" 
          onSuccess={() => setOpened(false)} 
        />
      </Drawer>
    </>
  );
}
