"use client";

import {
  Button,
  Container,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { submitContactForm } from "@/actions/contact";
import { contactFormSchema } from "@/lib/validation-schemas";
import { zodResolver } from "mantine-form-zod-resolver";

function ContactPageClient() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validate: zodResolver(contactFormSchema),
  });

  const handleSubmit = async (values: typeof form.values) => {
    form.validate();
    if (!form.isValid()) {
      showNotification({
        title: "Error",
        message: "Please fill in all fields",
        color: "red",
      });
      return;
    }
    try {
      setLoading(true);

      const result = await submitContactForm(values);

      if (result.error) {
        throw new Error(
          result.error instanceof Error
            ? result.error.message
            : "Unknown error occurred"
        );
      }

      showNotification({
        title: "Success",
        message:
          "Your message has been sent successfully! We'll get back to you soon.",
        color: "teal",
      });

      form.reset();
    } catch (error) {
      showNotification({
        title: "Error",
        message:
          error instanceof Error ? error.message : "Failed to send message",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="md">
      <Stack py={{ base: "4rem", sm: "6rem" }}>
        <Text ta="center" c="dimmed" size="sm">
          Contact
        </Text>
        <Title order={1} fw={500} ta="center">
          Get in touch with us
        </Title>
        <Group justify="center">
          <Text ta="center" c="dimmed" size="sm" maw={500}>
            Whether you have a question, need support, or just want to learn
            more about Teamlypro, our team is here to help.
          </Text>
        </Group>
        {/* TODO: Add cards to contact through Discord or whatsapp */}
      </Stack>
      <Group justify="center">
        <Stack pb={{ base: "4rem", sm: "6rem" }} maw={600} w="100%">
          <Text fw={500}>Send us a message</Text>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                label="Full Name"
                placeholder="Your name"
                required
                {...form.getInputProps("name")}
              />
              <TextInput
                label="Email"
                placeholder="Your email"
                required
                {...form.getInputProps("email")}
              />
              <Textarea
                label="Message"
                placeholder="Your message"
                required
                autosize
                minRows={4}
                {...form.getInputProps("message")}
              />
              {/* TODO: When we have terms here will be the input to agree */}
              <Button fullWidth type="submit" mt="md" loading={loading}>
                Send message
              </Button>
            </Stack>
          </form>
        </Stack>
      </Group>
    </Container>
  );
}

export default ContactPageClient;
