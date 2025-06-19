import { getServiceBookingPageData } from "@/actions/booking";
import { getAvailableSlots } from "@/actions/slots";
import BookingServiceDateInput from "@/components/BookingServiceDateInput";
import BookingServiceMembersToggle from "@/components/BookingServiceMembersToggle";
import BookingServiceSlots from "@/components/BookingServiceSlots";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Text,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

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
  const { serviceId, date, members } = await searchParams;

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

  const slots = getAvailableSlots({
    teamId: service.team.id,
    serviceId,
    date: date as string,
    employeeIds: typeof members === "string" ? members.split(",") : [],
  });

  return (
    <Container py="xl" size="xs">
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
        <Flex direction="column" gap="md">
          <Flex direction="column" gap="md">
            <Text fw={600} size="sm">
              Minimum booking notice
            </Text>
            <Text size="sm" c="dimmed">
              {service.team.settings?.minBookingNoticeMinutes} minutes
            </Text>
          </Flex>
          <Flex direction="column" gap="md">
            <Text fw={600} size="sm">
              Team member
            </Text>
            {service.team.members.length > 0 ? (
              <BookingServiceMembersToggle
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
            <Suspense fallback={<div>Loading...</div>}>
              <BookingServiceSlots slots={slots} service={service} />
            </Suspense>
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
