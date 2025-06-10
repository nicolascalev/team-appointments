"use client";

import { updateService } from "@/actions/service";
import { TeamAdminPage, TeamService } from "@/lib/types";
import { Button, Drawer } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";
import ServiceForm from "./ServiceForm";
import { tryCatch } from "@/lib/try-catch";
import { z } from "zod";
import { createServiceSchema } from "@/lib/validation-schemas";

type ServiceFormValues = z.infer<typeof createServiceSchema>;

interface UpdateServiceDrawerProps {
  trigger?: React.ReactNode;
  team: TeamAdminPage;
  service: TeamService;
}

export default function UpdateServiceDrawer({
  trigger,
  team,
  service,
}: UpdateServiceDrawerProps) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: ServiceFormValues) => {
    try {
      setLoading(true);
      const { error } = await tryCatch(
        updateService({
          ...values,
          id: service.id,
        })
      );

      if (error) {
        notifications.show({
          title: "Error",
          message: error.message || "Failed to update service",
          color: "red",
        });
        return;
      }

      notifications.show({
        title: "Success",
        message: "Service updated successfully",
        color: "green",
      });
      setOpened(false);
    } catch (error: unknown) {
      console.error("Failed to update service:", error);
      notifications.show({
        title: "Error",
        message: "Failed to update service",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = (
    <Button
      variant="default"
      rightSection={<IconChevronRight size={14} />}
      onClick={() => setOpened(true)}
    >
      Edit
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
        title="Update Service"
        position="right"
        size="md"
      >
        <ServiceForm
          onSubmit={handleSubmit}
          defaultValues={service}
          team={team}
          submitLabel="Update"
          loading={loading}
        />
      </Drawer>
    </>
  );
} 