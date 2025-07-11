"use client";

import { createService } from "@/actions/service";
import { TeamAdminPage } from "@/lib/types";
import { Button, Drawer } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";
import ServiceForm from "./ServiceForm";
import { tryCatch } from "@/lib/try-catch";
import { z } from "zod";
import { createServiceSchema } from "@/lib/validation-schemas";

type ServiceFormValues = z.infer<typeof createServiceSchema>;

interface CreateServiceDrawerProps {
  trigger?: React.ReactNode;
  team: TeamAdminPage;
}

export default function CreateServiceDrawer({
  trigger,
  team,
}: CreateServiceDrawerProps) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: ServiceFormValues) => {
    try {
      setLoading(true);
      const { error } = await tryCatch(
        createService({
          ...values,
        })
      );

      if (error) {
        notifications.show({
          title: "Error",
          message: error.message || "Failed to create service",
          color: "red",
        });
        return;
      }

      notifications.show({
        title: "Success",
        message: "Service created successfully",
        color: "green",
      });
      setOpened(false);
    } catch (error: unknown) {
      console.error("Failed to create service:", error);
      notifications.show({
        title: "Error",
        message: "Failed to create service",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = (
    <Button
      variant="default"
      mt="md"
      rightSection={<IconChevronRight size={14} />}
      onClick={() => setOpened(true)}
    >
      Add service
    </Button>
  );

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpened(true)}>{trigger}</div>
      ) : (
        defaultTrigger
      )}

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Create Service"
        position="right"
        size="md"
      >
        <ServiceForm
          onSubmit={handleSubmit}
          team={team}
          submitLabel="Create"
          loading={loading}
        />
      </Drawer>
    </>
  );
}
