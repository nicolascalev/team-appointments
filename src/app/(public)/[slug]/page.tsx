import {
  Button,
  Avatar,
  Card,
  Container,
  Divider,
  Flex,
  Group,
  Select,
  Text,
} from "@mantine/core";
import { IconChevronRight, IconClock, IconLocation, IconMail, IconPhone } from "@tabler/icons-react";
import React from "react";

function TeamPage() {
  return (
    <Container py="xl" size="md">
      <Flex direction="column" gap="xl">
        <Group>
          <Avatar>PN</Avatar>
          <div>
            <Text fw={500}>Perla Negra</Text>
            <Text size="sm" c="dimmed">
              Tattoo Shop
            </Text>
          </div>
        </Group>
        <Flex direction="column" gap="xs">
          <Text size="sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </Text>
          <Group wrap="nowrap" gap="xs">
            <IconLocation size={14} />
            <Text size="sm">Lorem ipsum dolor sit</Text>
          </Group>
          <Group wrap="nowrap" gap="xs" align="flex-start">
            <IconClock size={14} className="mt-1" />
            <Text size="sm">
              Monday: 10:00 AM - 6:00 PM
              <br />
              Tuesday: 10:00 AM - 6:00 PM
              <br />
              Wednesday: 10:00 AM - 6:00 PM
              <br />
              Thursday: 10:00 AM - 6:00 PM
            </Text>
          </Group>
          <Group wrap="nowrap" gap="xs">
            <IconMail size={14} />
            <Text size="sm">perla.negra@gmail.com</Text>
          </Group>
          <Group wrap="nowrap" gap="xs">
            <IconPhone size={14} />
            <Text size="sm">+123 456 7890</Text>
          </Group>
        </Flex>
        <Divider />
        <Flex direction="column" gap="md">
          <Text fw={500}>Team</Text>
          <Group>
            <Flex direction="column" gap="4" align="center" w={100} maw={100}>
              <Avatar>BG</Avatar>
              <Text fw={500} size="sm" truncate="end" ta="center" w={100} maw={100}>
                Bryan Guillen
              </Text>
              <Text size="xs" c="dimmed" truncate="end" ta="center" w={100} maw={100} >
                Tattoo Artist
              </Text>
            </Flex>
            <Flex direction="column" gap="4" align="center" w={100} maw={100}>
              <Avatar>BG</Avatar>
              <Text fw={500} size="sm" truncate="end" ta="center" w={100} maw={100}>
                Bryan Guillen
              </Text>
              <Text size="xs" c="dimmed" truncate="end" ta="center" w={100} maw={100} >
                Tattoo Artist
              </Text>
            </Flex>
          </Group>
        </Flex>
        <Divider />
        <Flex direction="column" gap="md">
          <Text fw={500}>Services</Text>
          <Select
            data={["All", "Tattoo", "Piercing"]}
            placeholder="Select a service"
            defaultValue={"All"}
            maw={300}
          />
          <Card withBorder>
            <Flex direction="column" gap="xs">
              <Text fw={500}>Tattoo</Text>
              <Text size="sm" c="dimmed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, quos.
              </Text>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  $100 - 1 hour
                </Text>
                <Button
                  variant="light"
                  rightSection={<IconChevronRight size={14} />}
                >
                  Book
                </Button>
              </Group>
            </Flex>
          </Card>
        </Flex>
      </Flex>
    </Container>
  );
}

export default TeamPage;
