"use client";

import {
  Button,
  Drawer,
  TextInput,
  Textarea,
  Select,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { createTeam } from "@/actions/team";
import { timeZones } from "@/lib/timezones";
import { slugify } from "@/lib/utils";
import PhotoInput from "./PhotoInput";
import { useRouter } from "next/navigation";

interface CreateTeamDrawerProps {
  trigger?: React.ReactNode;
}

export default function CreateTeamDrawer({ trigger }: CreateTeamDrawerProps) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      name: "",
      category: "",
      bio: "",
      slug: "",
      location: "",
      contactEmail: "",
      contactPhone: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      avatar: null as File | null,
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must be at least 2 characters" : null,
      slug: (value) =>
        value && !/^[a-z0-9-]+$/.test(value)
          ? "Slug can only contain lowercase letters, numbers, and hyphens"
          : null,
      contactEmail: (value) =>
        value && !/^\S+@\S+$/.test(value) ? "Invalid email" : null,
    },
  });

  const handleNameChange = (value: string) => {
    form.setFieldValue("name", value);
    form.setFieldValue("slug", slugify(value));
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true);

      const result = await createTeam({
        ...values,
        avatar: values.avatar || undefined,
      });

      if (result.success) {
        notifications.show({
          title: "Success",
          message: "Team created successfully",
          color: "green",
        });
        setOpened(false);
        form.reset();
        router.push(`/admin`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message:
          error instanceof Error ? error.message : "Failed to create team",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

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
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <PhotoInput
              buttonLabel="Upload team avatar"
              onChange={(file) => form.setFieldValue("avatar", file)}
            />

            <TextInput
              label="Team Name"
              placeholder="Enter team name"
              required
              {...form.getInputProps("name")}
              onChange={(e) => handleNameChange(e.target.value)}
            />

            <TextInput
              label="Slug"
              placeholder="team-slug"
              description="This will be used in the URL"
              {...form.getInputProps("slug")}
            />

            <TextInput
              label="Category"
              placeholder="e.g., Healthcare, Education"
              {...form.getInputProps("category")}
            />

            <Textarea
              label="Bio"
              placeholder="Tell us about your team"
              autosize
              minRows={2}
              {...form.getInputProps("bio")}
            />

            <TextInput
              label="Location"
              placeholder="City, Country"
              {...form.getInputProps("location")}
            />

            <TextInput
              label="Contact Email"
              placeholder="contact@example.com"
              {...form.getInputProps("contactEmail")}
            />

            <TextInput
              label="Contact Phone"
              placeholder="+1234567890"
              {...form.getInputProps("contactPhone")}
            />

            <Select
              label="Timezone"
              data={timeZones}
              searchable
              required
              {...form.getInputProps("timezone")}
            />

            <Button type="submit" loading={loading}>
              Create Team
            </Button>
          </Stack>
        </form>
      </Drawer>
    </>
  );
}
