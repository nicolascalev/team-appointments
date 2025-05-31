"use client";

import { signUp } from "@/actions/auth";
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

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterForm>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: zodResolver(registerSchema),
  });

  const handleSubmit = async (values: RegisterForm) => {
    try {
      setLoading(true);
      const result = await signUp({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (!result.success) {
        throw new Error(result.message || "Registration failed");
      }

      notifications.show({
        title: "Success",
        message: "Account created successfully",
        color: "teal",
      });

      router.push("/login");
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
        <Text size="xl" fw={700} mb="md">
          Register
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Name"
            placeholder="Your name"
            required
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            mt="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            mt="md"
            {...form.getInputProps("confirmPassword")}
          />
          <Button fullWidth mt="md" type="submit" loading={loading}>
            Create Account
          </Button>
        </form>
        <Divider my="md" />
        <Group justify="center">
          <Text size="sm" c="dimmed">
            Already have an account?{" "}
            <Button
              variant="subtle"
              size="sm"
              onClick={() => router.push("/login")}
              color="teal"
            >
              Login
            </Button>
          </Text>
        </Group>
      </Card>
    </Center>
  );
}
