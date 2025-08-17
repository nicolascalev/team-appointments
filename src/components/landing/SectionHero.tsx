import {
  BackgroundImage,
  Button,
  Card,
  Center,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";

function SectionHero() {
  return (
    <Container size="xl" py={{ base: "4rem", sm: "6rem" }}>
      <div className="flex justify-center mb-4">
        <Card withBorder py="4px" px="8px" radius="xl">
          <Text size="xs">🎉 Exciting news! Teamlypro is now available for free!</Text>
        </Card>
      </div>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Stack justify="center">
          <Text c="dimmed" size="sm" ta={{ base: "center", sm: "left" }}>
            Welcome to Teamlypro
          </Text>
          <Title order={1} fw={500} ta={{ base: "center", sm: "left" }}>
            The best way to manage your team
          </Title>
          <Text ta={{ base: "center", sm: "left" }}>
            Teamlypro is a platform that helps you manage your team.
          </Text>
          <div className="flex justify-center md:justify-start">
            <Button color="dark.9">Get Started</Button>
          </div>
        </Stack>
        <div>
          <SimpleGrid cols={{ base: 1, sm: 2 }} mih={400} spacing="xs">
            <BackgroundImage src="/landing/avatar.webp" radius="sm" mih={300} />
            <Card bg="dark.9">
              <Stack justify="space-between" h="100%">
                <Text size="xl" c="white">
                  65% Increase{" "}
                  <Text c="dark.1" component="span">
                    in operational efficiency
                  </Text>
                </Text>
                <Text size="sm" c="dark.1">
                  From customers who used Teamlypro for at least 6 months
                </Text>
              </Stack>
            </Card>
          </SimpleGrid>
          <Card bg="teal.7" p="xl" mt="xs">
            <Center>
              <Button color="dark.9" leftSection={<IconDownload size={16} />}>
                Export data from this month
              </Button>
            </Center>
          </Card>
        </div>
      </SimpleGrid>
    </Container>
  );
}

export default SectionHero;
