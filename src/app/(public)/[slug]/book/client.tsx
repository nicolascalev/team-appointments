"use client";

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
  Grid,
  GridCol,
  Group,
  Divider,
  Stack,
  Text,
  List,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import Link from "next/link";
import { BookingService } from "@/lib/types";
import { useState, useEffect } from "react";

function BookServiceClient({
  service,
  slug,
}: {
  service: BookingService;
  slug: string;
}) {
  const minDate = new Date(
    Date.now() +
      (service.team.settings?.minBookingNoticeMinutes ?? 5) * 60 * 1000
  );

  // State for selected slot
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // State to track URL parameters
  const [urlParams, setUrlParams] = useState({
    date: undefined as string | undefined,
    employeeIds: undefined as string[] | undefined,
  });

  // State to track loaded slots
  const [loadedSlots, setLoadedSlots] = useState<string[]>([]);

  // Update URL parameters when they change
  useEffect(() => {
    const updateParams = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const date = searchParams.get("date") || undefined;
      const members = searchParams.get("members");
      const employeeIds = members ? members.split(",") : undefined;

      setUrlParams({ date, employeeIds });
    };

    // Initial update
    updateParams();

    // Listen for URL changes
    const handleUrlChange = () => updateParams();
    window.addEventListener("popstate", handleUrlChange);

    // Custom event for URL updates (from our components)
    const handleUrlUpdate = () => updateParams();
    window.addEventListener("urlUpdated", handleUrlUpdate);

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("urlUpdated", handleUrlUpdate);
    };
  }, []);

  // Handle slot selection
  const handleSlotChange = (slot: string | null) => {
    setSelectedSlot(slot);
  };

  // Handle slots change
  const handleSlotsChange = (slots: string[]) => {
    setLoadedSlots(slots);
  };

  // Now you have access to:
  // - urlParams.employeeIds (URL employee IDs)
  // - urlParams.date (URL date)
  // - selectedSlot (selected slot)
  // - loadedSlots (slots list)

  // Example usage:
  // console.log('URL date:', urlParams.date);
  // console.log('URL employee IDs:', urlParams.employeeIds);
  // console.log('Selected slot:', selectedSlot);
  // console.log('Loaded slots:', loadedSlots);

  const hasAvailabilityError =
    !slotsLoading &&
    urlParams.employeeIds?.length &&
    urlParams.date &&
    loadedSlots.length === 0;

  return (
    <Container py="xl" size="lg">
      <Button
        component={Link}
        href={`/${slug}`}
        leftSection={<IconChevronLeft size={14} />}
        variant="default"
        mb="xl"
      >
        Back
      </Button>
      <Grid gutter={{ base: "md", md: "xl" }}>
        <GridCol
          span={{ base: 0, md: 4 }}
          display={{ base: "none", md: "block" }}
        >
          <Stack>
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
            <Divider />
            <Text fw={500}>Business hours</Text>
            <div>
              {service.team.businessHours.map((availability) => (
                <Text key={availability.id} size="sm" c="dimmed">
                  {new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
                    new Date(2024, 0, availability.dayOfWeek)
                  )}
                  : {availability.openTime} - {availability.closeTime}
                </Text>
              ))}
            </div>
            <Divider />
            <Text fw={500}>Member availability</Text>
            {service.team.members.map((member) => (
              <div key={member.id}>
                <Text size="sm" fw={500}>
                  {member.user.name}
                </Text>
                {member.availability.map((availability) => (
                  <Text key={availability.id} size="sm" c="dimmed">
                    {new Intl.DateTimeFormat("en-US", {
                      weekday: "long",
                    }).format(new Date(2024, 0, availability.dayOfWeek))}
                    : {availability.startTime} - {availability.endTime}
                  </Text>
                ))}
              </div>
            ))}
          </Stack>
        </GridCol>
        <GridCol span={{ base: 12, md: 8 }}>
          <Flex direction="column" gap="md">
            <Text fw={500}>Book service</Text>
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
              {hasAvailabilityError && (
                <Alert
                  title="No availability"
                  color="orange"
                  icon={<IconAlertCircle size={16} />}
                >
                  No availability found for the selected date and team member.
                  <List size="sm" listStyleType="disc">
                    <List.Item>
                      The selected members may not be scheduled to work on the
                      selected date.
                    </List.Item>
                    <List.Item>
                      The selected members may have approved time off for the
                      selected date.
                    </List.Item>
                  </List>
                </Alert>
              )}
              <div>
                <BookingServiceDateInput
                  minDate={minDate}
                  businessHours={service.team.businessHours}
                />
              </div>
              <div>
                <BookingServiceSlots
                  service={service}
                  selectedSlot={selectedSlot}
                  onSlotChange={handleSlotChange}
                  onSlotsChange={handleSlotsChange}
                  onLoadingChange={setSlotsLoading}
                />
              </div>
            </Flex>
            <Group justify="flex-end" mt="xl">
              <Button
                rightSection={<IconChevronRight size={14} />}
                disabled={!service.isActive || !selectedSlot}
              >
                Book
              </Button>
            </Group>
          </Flex>
        </GridCol>
      </Grid>
    </Container>
  );
}

export default BookServiceClient;
