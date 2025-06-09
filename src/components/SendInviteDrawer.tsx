"use client";
import { Drawer, Button, Text, Stack, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { MultiSelectCreatable } from "./MultiSelectCreatable";
import { IconChevronRight } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { sendTeamInvites } from "@/actions/team";
import { useState } from "react";

interface SendInviteDrawerProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

interface FormValues {
  emails: string[];
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SendInviteDrawer({ trigger, onSuccess }: SendInviteDrawerProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({
    initialValues: {
      emails: [],
    },
    validate: {
      emails: (value) =>
        value.length === 0 ? "Please add at least one email" : null,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    const validEmails = values.emails.filter((email) =>
      EMAIL_REGEX.test(email)
    );

    if (validEmails.length === 0) {
      showNotification({
        title: "Error",
        message: "Please add at least one valid email address",
        color: "red",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: createdInvitesCount, error } = await sendTeamInvites(
        validEmails
      );

      if (error) {
        showNotification({
          title: "Error",
          message: error,
          color: "red",
        });
        return;
      }

      showNotification({
        title: "Success",
        message: `Successfully sent ${createdInvitesCount} invite${
          createdInvitesCount === 1 ? "" : "s"
        }`,
        color: "green",
      });

      // Reset form and close drawer
      form.reset();
      close();
      onSuccess?.();
    } catch {
      showNotification({
        title: "Error",
        message: "An unexpected error occurred",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <Button
      variant="default"
      mt="md"
      rightSection={<IconChevronRight size={14} />}
      onClick={open}
    >
      Send invite
    </Button>
  );

  const invalidEmails = form.values.emails.filter(
    (email) => !EMAIL_REGEX.test(email)
  );
  const hasInvalidEmails = invalidEmails.length > 0;

  return (
    <>
      {trigger || defaultTrigger}
      <Drawer
        opened={opened}
        onClose={close}
        title="Send Invites"
        position="right"
        size="md"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Text size="sm" c="dimmed">
              Add email addresses of people you want to invite. You can add
              multiple emails.
            </Text>

            <MultiSelectCreatable
              options={form.values.emails}
              value={form.values.emails}
              onChange={(value) => form.setFieldValue("emails", value)}
            />

            {hasInvalidEmails && (
              <Text size="xs" c="red">
                {invalidEmails.length}{" "}
                {invalidEmails.length === 1 ? "value is" : "values are"} not
                valid emails and will be removed from the list
              </Text>
            )}

            <Group justify="flex-end">
              <Button variant="default" onClick={close} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" loading={isLoading}>
                Send Invites
              </Button>
            </Group>
          </Stack>
        </form>
      </Drawer>
    </>
  );
}

export default SendInviteDrawer;
