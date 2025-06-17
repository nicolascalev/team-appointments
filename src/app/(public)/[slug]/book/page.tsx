import { getServiceBookingPageData } from "@/actions/booking";
import BookingServiceDateInput from "@/components/BookingServiceDateInput";
import MembersToggle from "@/components/MembersToggle";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Select,
  Text,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type Params = { slug: string };
type SearchParams = { [key: string]: string | string[] | undefined };

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const { serviceId } = await searchParams;

  if (!serviceId || typeof serviceId !== "string") {
    return redirect(`/${slug}`);
  }

  const { data: service, error: serviceError } =
    await getServiceBookingPageData(serviceId);

  if (serviceError) {
    return <div>{serviceError}</div>;
  }

  if (!service) {
    return notFound();
  }

  const minDate = new Date(
    Date.now() +
      (service.team.settings?.minBookingNoticeMinutes ?? 5) * 60 * 1000
  );

  return (
    <Container py="xl" size="md">
      <Flex direction="column" gap="md">
        <div>
          <Button
            component={Link}
            href={`/${slug}`}
            leftSection={<IconChevronLeft size={14} />}
            variant="default"
          >
            Back
          </Button>
        </div>
        <Text fw={500} mt="xl">
          Book service
        </Text>
        <Group>
          <Avatar src={service.team.avatarUrl}>
            {service.team.name.slice(0, 2)}
          </Avatar>
          <div>
            <Text fw={500}>{service.team.name}</Text>
            <Text size="sm" c="dimmed">
              {service.team.category}
            </Text>
          </div>
        </Group>
        {!service.isActive && (
          <Alert
            title="Service is not active"
            color="red"
            icon={<IconAlertCircle size={16} />}
          >
            This service is not active and cannot be booked.
          </Alert>
        )}
        <Card withBorder>
          <Flex direction="column" gap="xs">
            <Text fw={500}>
              {service.name}
              {service.category && (
                <>
                  <br />
                  <Text component="span" size="xs" c="teal">
                    {service.category}
                  </Text>
                </>
              )}
            </Text>
            <Text size="sm" c="dimmed">
              {service.description}
            </Text>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                {service.price} {service.currencyCode} - {service.duration}{" "}
                minutes
              </Text>
            </Group>
          </Flex>
        </Card>
        <Flex direction="column" gap="md" mt="xl">
          <Flex direction="column" gap="md">
            <Text fw={600} size="sm">
              Team member
            </Text>
            {service.team.members.length > 0 ? (
              <MembersToggle
                members={service.team.members}
                defaultSelectedMembers={service.team.members}
              />
            ) : (
              <Text size="sm" c="dimmed">
                No team members are available to book this service at the
                moment.
              </Text>
            )}
          </Flex>
          <div>
            <BookingServiceDateInput
              minDate={minDate}
              businessHours={service.team.businessHours}
            />
          </div>
          <div>
            <Select
              label="Slot"
              data={[
                "10:00 AM",
                "11:00 AM",
                "12:00 PM",
                "1:00 PM",
                "2:00 PM",
                "3:00 PM",
                "4:00 PM",
                "5:00 PM",
                "6:00 PM",
                "7:00 PM",
                "8:00 PM",
                "9:00 PM",
                "10:00 PM",
              ]}
              placeholder="Select a slot"
              maw={{ sm: 300 }}
            />
          </div>
        </Flex>
        <Group justify="flex-end" mt="xl">
          <Button
            rightSection={<IconChevronRight size={14} />}
            disabled={!service.isActive}
          >
            Book
          </Button>
        </Group>
      </Flex>
    </Container>
  );
}
