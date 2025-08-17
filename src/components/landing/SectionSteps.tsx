import {
  Container,
  SimpleGrid,
  Text,
  Title,
  Button,
  Stack,
} from "@mantine/core";
import React from "react";

function SectionSteps() {
  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #fff 0%, #F6F4F1 100%)",
      }}
    >
      <Container size="xl" py={{ base: "4rem", sm: "6rem" }}>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
          <Stack gap="xs">
            <Text c="dimmed" size="sm">
              Quick onboarding
            </Text>
            <Title order={1} fw={500}>
              You can get started today with a few steps
            </Title>
            <Text>
              Teamlypro feels familiar and intuitive, so you can get started in
              no time, and share your booking link with your clients.
            </Text>
            <div>
              <Button color="dark.8">Get Started</Button>
            </div>
          </Stack>
          <Stack gap="xs">
            <Step />
            <Step />
            <Step />
            <Step />
          </Stack>
        </SimpleGrid>
      </Container>
    </div>
  );
}

export default SectionSteps;

function Step() {
  return (
    <div className="flex flex-nowrap gap-4">
      <div className="flex flex-col justify-center items-center w-2">
        <div className="h-2 w-2 bg-[#141414] rounded-full mb-3"></div>
        <div className="flex justify-center w-full grow">
          <div className="w-[1px] bg-[#b8b8b8] h-full"></div>
        </div>
      </div>
      <div className="pb-8">
        <Text c="dimmed" size="sm">
          STEP 1
        </Text>
        <Text fw={500}>Create a team</Text>
        <Text c="dimmed" size="sm" mt="xs">
          Create a team, and edit your basic team or business information so it
          can be found easily.
        </Text>
      </div>
    </div>
  );
}
