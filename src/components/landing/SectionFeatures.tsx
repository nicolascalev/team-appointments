import {
  Avatar,
  BackgroundImage,
  Box,
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { IconCheck, IconPlayerPlay } from "@tabler/icons-react";

function SectionFeatures() {
  return (
    <div className="bg-[#F6F4F1]">
      <Container size="xl" py={{ base: "4rem", sm: "6rem" }}>
        <Stack gap="xl">
          <Group justify="center">
            <Text ta="center" size="xl" fw={600} maw={600}>
              Customers love Teamlypro.{" "}
              <Text c="dimmed" component="span" fw={600}>
                Over 1000 companies rely on Teamlypro to manage{" "}
              </Text>
              their teams.
            </Text>
          </Group>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
            <Card>
              <Stack>
                <IconCheck size={24} />
                <Text>
                  Securely store, manage, and access{" "}
                  <Text c="dimmed" component="span">
                    critical business data from secure app portals in real time
                    with ease.
                  </Text>
                </Text>
              </Stack>
            </Card>
            <Card>
              <Stack>
                <IconCheck size={24} />
                <Text>
                  Securely store, manage, and access{" "}
                  <Text c="dimmed" component="span">
                    critical business data from secure app portals in real time
                    with ease.
                  </Text>
                </Text>
              </Stack>
            </Card>
            <Card>
              <Stack>
                <IconCheck size={24} />
                <Text>
                  Securely store, manage, and access{" "}
                  <Text c="dimmed" component="span">
                    critical business data from secure app portals in real time
                    with ease.
                  </Text>
                </Text>
              </Stack>
            </Card>
            <Card>
              <Stack>
                <IconCheck size={24} />
                <Text>
                  Securely store, manage, and access{" "}
                  <Text c="dimmed" component="span">
                    critical business data from secure app portals in real time
                    with ease.
                  </Text>
                </Text>
              </Stack>
            </Card>
            <Card>
              <Stack>
                <IconCheck size={24} />
                <Text>
                  Securely store, manage, and access{" "}
                  <Text c="dimmed" component="span">
                    critical business data from secure app portals in real time
                    with ease.
                  </Text>
                </Text>
              </Stack>
            </Card>
            <Card>
              <Stack>
                <IconCheck size={24} />
                <Text>
                  Securely store, manage, and access{" "}
                  <Text c="dimmed" component="span">
                    critical business data from secure app portals in real time
                    with ease.
                  </Text>
                </Text>
              </Stack>
            </Card>
          </SimpleGrid>
          <Group justify="center">
            <Card bg="dark.9" w="100%" maw={600}>
              <Group
                justify="space-between"
                align="center"
                display={{ base: "none", md: "flex" }}
              >
                <Group justify="space-between" align="center">
                  <Avatar src="/landing/avatar.webp" radius="100%" />
                  <div>
                    <Text c="white">Hello, I&apos;m Nicolas from support.</Text>
                    <Text size="sm" c="dimmed">
                      Let me know if you have any questions.
                    </Text>
                  </div>
                </Group>
                <Button>Contact us</Button>
              </Group>
              <Stack align="center" display={{ base: "flex", md: "none" }}>
                <Avatar src="/landing/avatar.webp" radius="100%" />
                <div>
                  <Text c="white" ta="center">
                    Hello, I&apos;m Nicolas from support.
                  </Text>
                  <Text size="sm" c="dimmed" ta="center">
                    Let me know if you have any questions.
                  </Text>
                </div>
                <Button>Contact us</Button>
              </Stack>
            </Card>
          </Group>
        </Stack>
      </Container>
      <Box p="md">
        <BackgroundImage src="/landing/demo-bg.webp" radius="md" w="100%" mih={400} p={{ md: "xl"}}>
          <Group mt="200px" align="end">
            <Stack maw={400}>
              <Text c="white" className="!text-lg md:!text-2xl">
                &quot;Teamlypro has been a game changer for us. It has made it
                so much easier to manage our teams and keep everyone on the same
                page.&quot;
              </Text>
              <div>
                <Text c="white">John Doe</Text>
                <Text size="sm" c="dimmed">
                  CEO, Company Name
                </Text>
              </div>
            </Stack>
            <div className="flex flex-nowrap justify-start md:justify-end gap-4 flex-grow">
              <Button
                variant="subtle"
                color="gray.1"
                leftSection={<IconPlayerPlay size={16} />}
              >
                Watch video
              </Button>
              <Button variant="white" color="dark">
                Get started
              </Button>
            </div>
          </Group>
        </BackgroundImage>
      </Box>
    </div>
  );
}

export default SectionFeatures;
