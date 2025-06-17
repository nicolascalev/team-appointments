import { getBookingPageData } from "@/actions/booking";
import BookingServicesList from "@/components/BookingServicesList";
import {
  Avatar,
  Container,
  Divider,
  Flex,
  Group,
  Text
} from "@mantine/core";
import {
  IconClock,
  IconLocation,
  IconMail,
  IconPhone
} from "@tabler/icons-react";
import { notFound } from "next/navigation";

async function TeamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data, error } = await getBookingPageData(slug);

  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return notFound();
  }

  return (
    <Container py="xl" size="md">
      <Flex direction="column" gap="xl">
        <Group>
          <Avatar src={data.avatarUrl}>{data.name.charAt(0)}</Avatar>
          <div>
            <Text fw={500}>{data.name}</Text>
            <Text size="sm" c="dimmed">
              {data.category}
            </Text>
          </div>
        </Group>
        <Flex direction="column" gap="xs">
          <Text size="sm">{data.bio}</Text>
          <Group wrap="nowrap" gap="xs">
            <IconLocation size={14} />
            <Text size="sm">{data.location}</Text>
          </Group>
          <Group wrap="nowrap" gap="xs" align="flex-start">
            <IconClock size={14} className="mt-1" />
            <div>
              {data.businessHours.map((availability) => (
                <Text key={availability.id} size="sm">
                  {new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
                    new Date(2024, 0, availability.dayOfWeek)
                  )}
                  : {availability.openTime} - {availability.closeTime}
                </Text>
              ))}
            </div>
          </Group>
          <Group wrap="nowrap" gap="xs">
            <IconMail size={14} />
            <Text size="sm">{data.contactEmail}</Text>
          </Group>
          <Group wrap="nowrap" gap="xs">
            <IconPhone size={14} />
            <Text size="sm">{data.contactPhone}</Text>
          </Group>
        </Flex>
        <Divider />
        <Flex direction="column" gap="md">
          <Text fw={500}>Team</Text>
          <Group align="flex-start">
            {data.members.map((member) => (
              <Flex
                key={member.id}
                direction="column"
                gap="4"
                align="center"
                w={100}
                maw={100}
              >
                <Avatar src={member.user.avatarUrl}>
                  {member.user.name?.charAt(0) || "U"}
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
                <Text
                  size="xs"
                  c="dimmed"
                  truncate="end"
                  ta="center"
                  w={100}
                  maw={100}
                >
                  {member.bio}
                </Text>
              </Flex>
            ))}
          </Group>
        </Flex>
        <Divider />
        <BookingServicesList services={data.services} />
      </Flex>
    </Container>
  );
}

export default TeamPage;
