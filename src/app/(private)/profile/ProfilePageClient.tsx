"use client";

import { User } from "../../../../prisma/generated";
import {
  Container,
  SimpleGrid,
  Text,
  Divider,
  TextInput,
  Stack,
  Button,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { updateUserProfile } from "@/actions/user";
import PhotoInput from "@/components/PhotoInput";
import { useRouter } from "next/navigation";

function ProfilePageClient({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      avatar: null as File | null,
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must be at least 2 characters" : null,
      email: (value) => (!/^\S+@\S+$/.test(value) ? "Invalid email" : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    form.validate();
    if (!form.isValid()) {
      notifications.show({
        title: "Error",
        message: "Please fill in all fields correctly",
        color: "red",
      });
      return;
    }

    try {
      setLoading(true);

      const updateProfileResult = await updateUserProfile({
        name: values.name,
        email: values.email,
        phone: values.phone,
        avatar: values.avatar || undefined,
      });

      if (updateProfileResult.error) {
        throw new Error(updateProfileResult.error as string);
      }

      notifications.show({
        title: "Success",
        message: "Profile updated successfully",
        color: "teal",
      });

      router.refresh();
    } catch (error) {
      notifications.show({
        title: "Error",
        message:
          error instanceof Error ? error.message : "Failed to update profile",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="md" p={0}>
      <SimpleGrid cols={{ base: 1, sm: 2 }} pt="md">
        <div>
          <Text fw={500}>Profile information</Text>
          <Text c="dimmed">Update your personal profile details</Text>
        </div>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <PhotoInput
              defaultSrc={user.avatarUrl || undefined}
              onChange={(file) => form.setFieldValue("avatar", file)}
            />

            <TextInput
              label="Name"
              placeholder="Enter your name"
              required
              {...form.getInputProps("name")}
            />

            <TextInput
              label="Email"
              placeholder="Enter your email"
              type="email"
              required
              {...form.getInputProps("email")}
            />

            <TextInput
              label="Phone"
              placeholder="Enter your phone number"
              {...form.getInputProps("phone")}
            />

            <Group justify="flex-end">
              <Button
                type="submit"
                loading={loading}
                w={{ base: "100%", sm: "auto" }}
              >
                Update Profile
              </Button>
            </Group>
          </Stack>
        </form>
      </SimpleGrid>
      <Divider my="xl" />
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <div>
          <Text fw={500}>Password</Text>
          <Text c="dimmed">Update your password</Text>
        </div>
        <div className="flex flex-col gap-4">
          {/* Password update form will go here */}
        </div>
      </SimpleGrid>
    </Container>
  );
}

export default ProfilePageClient;
