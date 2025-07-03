"use client";

import { createBooking } from "@/actions/booking";
import { bookingSchema } from "@/lib/validation-schemas";
import { BookingService, TeamMemberWithUser } from "@/lib/types";
import {
  Avatar,
  Button,
  Divider,
  Flex,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconChevronRight } from "@tabler/icons-react";
import moment from "moment";
import { useState } from "react";
import { useRouter } from "next/navigation";

function BookingServiceConfirm({
  service,
  selectedSlot,
  selectedMembers,
}: {
  service: BookingService;
  selectedSlot: string | null;
  selectedMembers: TeamMemberWithUser[] | undefined;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
    },
    validate: zodResolver(bookingSchema.pick({ name: true, email: true })),
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (!selectedSlot) return null;
    setLoading(true);
    if (!selectedMembers || selectedMembers.length === 0) {
      showNotification({
        title: "Error",
        message: "Please select at least one team member",
        color: "red",
      });
      setLoading(false);
      return;
    }

    const { error, data } = await createBooking({
      name: values.name,
      email: values.email,
      serviceId: service.id,
      employeeIds: selectedMembers.map((member) => member.id),
      timeSlot: selectedSlot,
    });

    if (error) {
      showNotification({
        title: "Error",
        message: error,
        color: "red",
      });
      setLoading(false);
      return;
    }

    showNotification({
      title: "Success",
      message: "Booking created successfully!",
      color: "green",
    });

    if (data) {
      router.push(`/confirmation/${data.id}`);
    }

    close();
    form.reset();
    setLoading(false);
  };

  return (
    <>
      <Button
        rightSection={<IconChevronRight size={14} />}
        disabled={!service.isActive || !selectedSlot}
        onClick={open}
      >
        Book
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        title={<Text fw={500}>Summary</Text>}
        size="md"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="xs">
            <div>
              <Text fw={500} size="sm">
                Service
              </Text>
              <Text size="sm">{service.name}</Text>
            </div>
            <div>
              <Text fw={500} size="sm">
                Date and time
              </Text>
              <Text size="sm">
                {moment(selectedSlot).format("dddd, MMMM D, YYYY h:mm A")}
              </Text>
            </div>
            <div>
              <Text fw={500} size="sm">
                Price
              </Text>
              <Text size="sm">
                {service.price} {service.currencyCode}
              </Text>
            </div>
            <div>
              <Text fw={500} size="sm" mb="xs">
                Available team members (one will be randomly assigned)
              </Text>
              <Group>
                {selectedMembers?.map((member) => (
                  <Flex
                    direction="column"
                    gap="4"
                    align="center"
                    w={100}
                    maw={100}
                    key={member.id}
                  >
                    <Avatar
                      src={member.user.avatarUrl || undefined}
                      alt={member.user.name || ""}
                    >
                      {member.user.name?.charAt(0)}
                    </Avatar>
                    <Text
                      fw={500}
                      size="sm"
                      truncate="end"
                      ta="center"
                      w={100}
                      maw={100}
                    >
                      {member.user.name}
                    </Text>
                  </Flex>
                ))}
              </Group>
            </div>
            <Divider my="md" />
            <Text fw={500}>Contact information</Text>
            <TextInput
              label="Name"
              placeholder="Enter your name"
              required
              key={form.key("name")}
              {...form.getInputProps("name")}
            />
            <TextInput
              label="Email"
              type="email"
              placeholder="Enter your email"
              required
              key={form.key("email")}
              {...form.getInputProps("email")}
            />
            <Button type="submit" fullWidth mt="md" loading={loading}>
              Confirm
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}

export default BookingServiceConfirm;
