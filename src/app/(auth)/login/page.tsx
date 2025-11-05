"use client";

import {
  requestPasswordReset,
  verifyResetCode,
  resetPasswordWithCode,
} from "@/actions/auth";
import { signIn } from "@/actions/auth";
import Logo from "@/components/Logo";
import {
  Anchor,
  Button,
  Card,
  Center,
  Divider,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const requestResetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const verifyCodeSchema = z.object({
  code: z.string().length(6, "Code must be 6 characters"),
});

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type LoginForm = z.infer<typeof loginSchema>;
type RequestResetForm = z.infer<typeof requestResetSchema>;
type VerifyCodeForm = z.infer<typeof verifyCodeSchema>;
type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

type ForgotPasswordStep = "email" | "code" | "password";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] =
    useState<ForgotPasswordStep>("email");
  const [resetEmail, setResetEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const form = useForm<LoginForm>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(loginSchema),
  });

  const requestResetForm = useForm<RequestResetForm>({
    initialValues: {
      email: "",
    },
    validate: zodResolver(requestResetSchema),
  });

  const verifyCodeForm = useForm<VerifyCodeForm>({
    initialValues: {
      code: "",
    },
    validate: zodResolver(verifyCodeSchema),
  });

  const resetPasswordForm = useForm<ResetPasswordForm>({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validate: zodResolver(resetPasswordSchema),
  });

  // Handle resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

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

  const handleRequestReset = async (values: RequestResetForm) => {
    try {
      setLoading(true);
      const requestResetResult = await requestPasswordReset(values.email);

      if (requestResetResult.error) {
        throw new Error(requestResetResult.error as string);
      }

      setResetEmail(values.email);
      setForgotPasswordStep("code");
      setResendCooldown(60);

      notifications.show({
        title: "Success",
        message:
          "If an account exists with this email, a reset code has been sent.",
        color: "teal",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message:
          error instanceof Error ? error.message : "Failed to send reset code",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (values: VerifyCodeForm) => {
    try {
      setLoading(true);
      const verifyCodeResult = await verifyResetCode(resetEmail, values.code);

      if (verifyCodeResult.error) {
        throw new Error(verifyCodeResult.error as string);
      }

      setForgotPasswordStep("password");
      notifications.show({
        title: "Success",
        message: "Code verified. Please enter your new password.",
        color: "teal",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message:
          error instanceof Error ? error.message : "Failed to verify code",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: ResetPasswordForm) => {
    try {
      setLoading(true);
      const resetPasswordResult = await resetPasswordWithCode(
        resetEmail,
        verifyCodeForm.values.code,
        values.newPassword,
        values.confirmPassword
      );

      if (resetPasswordResult.error) {
        throw new Error(resetPasswordResult.error as string);
      }

      notifications.show({
        title: "Success",
        message: "Password reset successfully. You can now login.",
        color: "teal",
      });

      // Reset forms and go back to login
      setShowForgotPassword(false);
      setForgotPasswordStep("email");
      setResetEmail("");
      requestResetForm.reset();
      verifyCodeForm.reset();
      resetPasswordForm.reset();
    } catch (error) {
      notifications.show({
        title: "Error",
        message:
          error instanceof Error ? error.message : "Failed to reset password",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    try {
      setLoading(true);
      const requestResetResult = await requestPasswordReset(resetEmail);

      if (requestResetResult.error) {
        throw new Error(requestResetResult.error as string);
      }

      setResendCooldown(60);
      notifications.show({
        title: "Success",
        message: "Reset code has been resent.",
        color: "teal",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message:
          error instanceof Error ? error.message : "Failed to resend code",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center mih="100dvh" p="md">
      <div className="w-full max-w-[400px]">
        {!showForgotPassword ? (
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
                >
                  Register
                </Button>
              </Text>
            </Group>
          </Card>
        ) : (
          <Card withBorder className="w-full max-w-[400px]">
            <Stack>
              <div>
                <Button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordStep("email");
                    setResetEmail("");
                    requestResetForm.reset();
                    verifyCodeForm.reset();
                    resetPasswordForm.reset();
                  }}
                  variant="default"
                  leftSection={<IconArrowLeft size={16} />}
                >
                  Back to login
                </Button>
              </div>

              {forgotPasswordStep === "email" && (
                <form onSubmit={requestResetForm.onSubmit(handleRequestReset)}>
                  <Text size="xl" fw={700}>
                    Forgot password?
                  </Text>
                  <Text size="sm" c="dimmed" mb="md">
                    Enter your email to receive a reset code
                  </Text>
                  <TextInput
                    label="Email"
                    placeholder="you@example.com"
                    required
                    mt="md"
                    {...requestResetForm.getInputProps("email")}
                  />
                  <Button fullWidth mt="md" type="submit" loading={loading}>
                    Send reset code
                  </Button>
                </form>
              )}

              {forgotPasswordStep === "code" && (
                <form onSubmit={verifyCodeForm.onSubmit(handleVerifyCode)}>
                  <Text size="xl" fw={700}>
                    Enter reset code
                  </Text>
                  <Text size="sm" c="dimmed" mb="md">
                    We sent a 6-character code to {resetEmail}. Please check
                    your email.
                  </Text>
                  <TextInput
                    label="Code"
                    placeholder="Enter 6-character code"
                    required
                    mt="md"
                    maxLength={6}
                    onChange={(e) => {
                      verifyCodeForm.setFieldValue(
                        "code",
                        e.target.value.toUpperCase()
                      );
                    }}
                    value={verifyCodeForm.values.code}
                  />
                  <Button fullWidth mt="md" type="submit" loading={loading}>
                    Verify code
                  </Button>
                  <Anchor
                    onClick={handleResendCode}
                    size="sm"
                    mt="md"
                    ta="center"
                    w="100%"
                    display="block"
                    style={{
                      cursor: resendCooldown > 0 ? "not-allowed" : "pointer",
                      opacity: resendCooldown > 0 ? 0.5 : 1,
                    }}
                  >
                    {resendCooldown > 0
                      ? `Resend code in ${resendCooldown}s`
                      : "Resend code"}
                  </Anchor>
                </form>
              )}

              {forgotPasswordStep === "password" && (
                <form
                  onSubmit={resetPasswordForm.onSubmit(handleResetPassword)}
                >
                  <Text size="xl" fw={700}>
                    Set new password
                  </Text>
                  <Text size="sm" c="dimmed" mb="md">
                    Enter your new password below
                  </Text>
                  <PasswordInput
                    label="New Password"
                    placeholder="Enter your new password"
                    required
                    mt="md"
                    {...resetPasswordForm.getInputProps("newPassword")}
                  />
                  <PasswordInput
                    label="Confirm Password"
                    placeholder="Confirm your new password"
                    required
                    mt="md"
                    {...resetPasswordForm.getInputProps("confirmPassword")}
                  />
                  <Button fullWidth mt="md" type="submit" loading={loading}>
                    Reset password
                  </Button>
                </form>
              )}
            </Stack>
          </Card>
        )}
        {!showForgotPassword && (
          <Anchor
            onClick={() => setShowForgotPassword(true)}
            size="sm"
            mt="md"
            ta="center"
            w="100%"
            display="block"
          >
            Forgot password?
          </Anchor>
        )}
      </div>
    </Center>
  );
}
