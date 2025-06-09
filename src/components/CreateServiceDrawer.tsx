"use client";

import { createService } from "@/actions/service";
import { TeamAdminPage } from "@/lib/types";
import { createServiceSchema } from "@/lib/validation-schemas";
import {
  Button,
  Drawer,
  Group,
  NumberInput,
  Select,
  Stack,
  // Switch,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";
import MembersToggle from "./MembersToggle";
import { tryCatch } from "@/lib/try-catch";

interface CreateServiceDrawerProps {
  trigger?: React.ReactNode;
  team: TeamAdminPage;
}

function CreateServiceDrawer({ trigger, team }: CreateServiceDrawerProps) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      category: "",
      duration: 30,
      buffer: 0,
      price: 0,
      currencyCode: "USD",
      isActive: true,
    },
    validate: zodResolver(createServiceSchema),
  });

  const handleSubmit = async (values: typeof form.values) => {
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
      form.reset();
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

  const schedulableMembers = team.members.filter(
    (member) => member.isSchedulable
  );
  console.log(team.members);

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
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Name"
              placeholder="Service name"
              required
              {...form.getInputProps("name")}
            />
            <Textarea
              label="Description"
              placeholder="Service description"
              autosize
              minRows={3}
              {...form.getInputProps("description")}
            />
            <TextInput
              label="Category"
              placeholder="Service category"
              {...form.getInputProps("category")}
            />
            <NumberInput
              label="Duration (minutes)"
              placeholder="Service duration"
              required
              min={1}
              {...form.getInputProps("duration")}
            />
            <NumberInput
              label="Buffer (minutes)"
              placeholder="Service buffer"
              required
              min={0}
              {...form.getInputProps("buffer")}
            />
            <NumberInput
              label="Price"
              placeholder="Service price"
              required
              min={0}
              decimalScale={2}
              {...form.getInputProps("price")}
            />
            <Select
              label="Currency"
              placeholder="Select currency"
              data={Intl.supportedValuesOf("currency")}
              searchable
              {...form.getInputProps("currencyCode")}
            />
            <div className="flex flex-col gap-2">
              <Text size="sm" fw={500}>
                Members assigned to this service
              </Text>
              {schedulableMembers.length === 0 ? (
                <Text size="sm" c="dimmed">
                  No schedulable members available
                </Text>
              ) : (
                <MembersToggle
                  members={schedulableMembers}
                  defaultSelectedMembers={schedulableMembers}
                />
              )}
            </div>
            {/* <Switch
              label="Active"
              {...form.getInputProps("isActive", { type: "checkbox" })}
            /> */}
            <Group justify="flex-end">
              <Button variant="default" onClick={() => setOpened(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Create
              </Button>
            </Group>
          </Stack>
        </form>
      </Drawer>
    </>
  );
}

export default CreateServiceDrawer;
