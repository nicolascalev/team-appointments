"use client";

import { signIn } from "@/actions/auth";
import Logo from "@/components/Logo";
import {
  Button,
  Card,
  Center,
  Divider,
  Group,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginForm>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(loginSchema),
  });

  const handleSubmit = async (values: LoginForm) => {
    try {
      setLoading(true);
      const result = await signIn(values);

      if (!result.success) {
        throw new Error(result.message || "Login failed");
      }

      notifications.show({
        title: "Success",
        message: "Logged in successfully",
        color: "teal",
      });

      router.push("/dashboard");
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error instanceof Error ? error.message : "An error occurred",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center mih="100dvh" p="md">
      <Card withBorder className="w-full max-w-[400px]">
        <Group justify="center">
          <Logo size="lg" />
        </Group>
        <Text size="xl" fw={700} mb="md" ta="center">
          Login to Teamlypro
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          <Button fullWidth mt="md" type="submit" loading={loading}>
            Sign in
          </Button>
        </form>
        <Divider my="md" />
        <Group justify="center">
          <Text size="sm" c="dimmed">
            Don&apos;t have an account?{" "}
            <Button
              variant="subtle"
              size="sm"
              onClick={() => router.push("/register")}
              color="indigo"
            >
              Register
            </Button>
          </Text>
        </Group>
      </Card>
    </Center>
  );
}
