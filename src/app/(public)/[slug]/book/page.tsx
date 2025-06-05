import MembersToggle from "@/components/MembersToggle";
import {
  Avatar,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Select,
  Text,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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
          <Avatar>PN</Avatar>
          <div>
            <Text fw={500}>Perla Negra</Text>
            <Text size="sm" c="dimmed">
              Tattoo Shop
            </Text>
          </div>
        </Group>
        <Card withBorder>
          <Flex direction="column" gap="xs">
            <Text fw={500}>Tattoo</Text>
            <Text size="sm" c="dimmed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quos.
            </Text>
            <Text size="sm" c="dimmed">
              $100 - 1 hour
            </Text>
          </Flex>
        </Card>
        <Flex direction="column" gap="md" mt="xl">
          <Flex direction="column" gap="md">
            <Text fw={600} size="sm">
              Team member
            </Text>
            <MembersToggle
              members={[
                {
                  id: "1",
                  userId: "user1",
                  teamId: "team1",
                  role: "ADMIN",
                  isActive: true,
                  isSchedulable: true,
                  joinedAt: new Date(),
                  bio: "Lead physician with 10 years of experience",
                  user: {
                    id: "user1",
                    name: "Dr. Sarah Johnson",
                    email: "sarah.johnson@example.com",
                    password: "hashed_password",
                    phone: "+1234567890",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    currentSessionTeamId: "",
                  },
                },
                {
                  id: "2",
                  userId: "user2",
                  teamId: "team1",
                  role: "MEMBER",
                  isActive: true,
                  isSchedulable: true,
                  joinedAt: new Date(),
                  bio: "Pediatric specialist",
                  user: {
                    id: "user2",
                    name: "Dr. Michael Chen",
                    email: "michael.chen@example.com",
                    password: "hashed_password",
                    phone: "+1234567891",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    currentSessionTeamId: "",
                  },
                },
                {
                  id: "3",
                  userId: "user3",
                  teamId: "team1",
                  role: "MEMBER",
                  isActive: true,
                  isSchedulable: true,
                  joinedAt: new Date(),
                  bio: "Family medicine practitioner",
                  user: {
                    id: "user3",
                    name: "Dr. Emily Rodriguez",
                    email: "emily.rodriguez@example.com",
                    password: "hashed_password",
                    phone: "+1234567892",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    currentSessionTeamId: "",
                  },
                },
                {
                  id: "4",
                  userId: "user4",
                  teamId: "team1",
                  role: "MEMBER",
                  isActive: true,
                  isSchedulable: true,
                  joinedAt: new Date(),
                  bio: "Internal medicine specialist",
                  user: {
                    id: "user4",
                    name: "Dr. James Wilson",
                    email: "james.wilson@example.com",
                    password: "hashed_password",
                    phone: "+1234567893",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    currentSessionTeamId: "",
                  },
                },
                {
                  id: "5",
                  userId: "user5",
                  teamId: "team1",
                  role: "MEMBER",
                  isActive: true,
                  isSchedulable: true,
                  joinedAt: new Date(),
                  bio: "Cardiology specialist",
                  user: {
                    id: "user5",
                    name: "Dr. Lisa Patel",
                    email: "lisa.patel@example.com",
                    password: "hashed_password",
                    phone: "+1234567894",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    currentSessionTeamId: "",
                  },
                },
              ]}
            />
          </Flex>
          <div>
            {/* TODOL the min date should be the next available slot. not the current date */}
            <DateInput
              label="Date"
              placeholder="Select a date"
              maw={{ sm: 300 }}
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
          <Button rightSection={<IconChevronRight size={14} />}>Book</Button>
        </Group>
      </Flex>
    </Container>
  );
}
