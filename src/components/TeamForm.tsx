"use client";

import {
  Button,
  TextInput,
  Textarea,
  Select,
  Stack,
  Popover,
  Text,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications, showNotification } from "@mantine/notifications";
import { useState, useEffect } from "react";
import { createTeam, updateTeam } from "@/actions/team";
import { timeZones } from "@/lib/timezones";
import { slugify } from "@/lib/utils";
import PhotoInput from "./PhotoInput";
import { useRouter } from "next/navigation";
import type { Prisma } from "../../prisma/generated";
import { IconInfoCircle } from "@tabler/icons-react";

interface TeamFormProps {
  mode: "create" | "update";
  initialValues?: Prisma.TeamCreateInput & { avatar?: File };
  onSuccess?: () => void;
}

export default function TeamForm({
  mode,
  initialValues,
  onSuccess,
}: TeamFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    initialValues: initialValues || {
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

  useEffect(() => {
    if (initialValues) {
      form.setValues(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  const handleNameChange = (value: string) => {
    form.setFieldValue("name", value);
    if (mode === "create") {
      form.setFieldValue("slug", slugify(value));
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true);

      const result =
        mode === "create"
          ? await createTeam({
              ...values,
              avatar: values.avatar || undefined,
            })
          : await updateTeam({
              ...values,
              avatar: values.avatar || undefined,
            });

      if (result.error) {
        throw new Error(result.error as string);
      }

      showNotification({
        title: "Success",
        message: `Team ${
          mode === "create" ? "created" : "updated"
        } successfully`,
        color: "teal",
      });
      form.reset();
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/admin`);
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message:
          error instanceof Error ? error.message : `Failed to ${mode} team`,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <PhotoInput
          defaultSrc={initialValues?.avatarUrl}
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
          rightSection={
            mode === "create" ? null : (
              <Popover width={300} withArrow shadow="md">
                <Popover.Target>
                  <IconInfoCircle size={14} className="cursor-pointer" />
                </Popover.Target>
                <Popover.Dropdown>
                  <Text size="xs">
                    Be careful when updating the slug. If you&apos;ve previously
                    shared your booking page URL, the old links will no longer
                    work.
                  </Text>
                </Popover.Dropdown>
              </Popover>
            )
          }
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

        <Group justify="flex-end">
          <Button type="submit" loading={loading} w={{ base: "100%", sm: "auto" }}>
            {mode === "create" ? "Create Team" : "Update Team"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
