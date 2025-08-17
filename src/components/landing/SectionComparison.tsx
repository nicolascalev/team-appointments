import {
  Container,
  Text,
  Card,
  Title,
  Button,
  Stack,
  SimpleGrid,
  Group,
} from "@mantine/core";
import React from "react";

function SectionComparison() {
  return (
    <Container size="xl" py={{ base: "4rem", sm: "6rem" }}>
      <Stack justify="center" align="center">
        <Text c="dimmed" size="sm" ta="center">
          Compare Teamlypro
        </Text>
        <Title order={1} fw={500} ta="center" maw={500}>
          What makes us better <br />
          than the rest
        </Title>
        <Text ta="center" maw={500}>
          We are the best team&apos;s scheduling solution on the market. We are
          the best on the market.
        </Text>
        <div className="flex justify-center w-full">
          <SimpleGrid
            cols={{ base: 1, sm: 2 }}
            w="100%"
            maw={600}
            mt="lg"
            spacing="xs"
            pos="relative"
          >
            <Card bg="dark.9" p="lg">
              <Stack gap="xs">
                <Title order={3} fw={500} c="white">
                  Teamlypro
                </Title>
                <div className="h-[0px] sm:h-[2rem]"></div>
                <div className="border-b border-b-[#242424] pb-1">
                  <Text c="dimmed" size="sm">
                    Speed
                  </Text>
                  <Text c="white" size="sm">
                    Over 9000
                  </Text>
                </div>
                <div className="border-b border-b-[#242424] pb-1">
                  <Text c="dimmed" size="sm">
                    Speed
                  </Text>
                  <Text c="white" size="sm">
                    Over 9000
                  </Text>
                </div>
                <div className="border-b border-b-[#242424] pb-1">
                  <Text c="dimmed" size="sm">
                    Speed
                  </Text>
                  <Text c="white" size="sm">
                    Over 9000
                  </Text>
                </div>
                <div className="border-b border-b-[#242424] pb-1">
                  <Text c="dimmed" size="sm">
                    Speed
                  </Text>
                  <Text c="white" size="sm">
                    Over 9000
                  </Text>
                </div>
                <div className="border-b">
                  <Text c="dimmed" size="sm">
                    Speed
                  </Text>
                  <Text c="white" size="sm">
                    Over 9000
                  </Text>
                </div>
              </Stack>
            </Card>
            <Card bg="dark.9" p="lg">
              <Stack gap="xs">
                <Title
                  order={3}
                  fw={500}
                  c="white"
                  ta={{ base: "left", sm: "right" }}
                >
                  Teamlypro
                </Title>
                <div className="h-[0px] sm:h-[2rem]"></div>
                <div className="border-b border-b-[#242424] pb-1">
                  <Text c="dimmed" size="sm" ta={{ base: "left", sm: "right" }}>
                    Speed
                  </Text>
                  <Text c="white" size="sm" ta={{ base: "left", sm: "right" }}>
                    Over 9000
                  </Text>
                </div>
                <div className="border-b border-b-[#242424] pb-1">
                  <Text c="dimmed" size="sm" ta={{ base: "left", sm: "right" }}>
                    Speed
                  </Text>
                  <Text c="white" size="sm" ta={{ base: "left", sm: "right" }}>
                    Over 9000
                  </Text>
                </div>
                <div className="border-b border-b-[#242424] pb-1">
                  <Text c="dimmed" size="sm" ta={{ base: "left", sm: "right" }}>
                    Speed
                  </Text>
                  <Text c="white" size="sm" ta={{ base: "left", sm: "right" }}>
                    Over 9000
                  </Text>
                </div>
                <div className="border-b border-b-[#242424] pb-1">
                  <Text c="dimmed" size="sm" ta={{ base: "left", sm: "right" }}>
                    Speed
                  </Text>
                  <Text c="white" size="sm" ta={{ base: "left", sm: "right" }}>
                    Over 9000
                  </Text>
                </div>
                <div className="border-b">
                  <Text c="dimmed" size="sm" ta={{ base: "left", sm: "right" }}>
                    Speed
                  </Text>
                  <Text c="white" size="sm" ta={{ base: "left", sm: "right" }}>
                    Over 9000
                  </Text>
                </div>
              </Stack>
            </Card>
            <div className="absolute left-1/2 bg-white py-2 px-4 text-center rounded-sm md:top-[68px] top-1/2 md:transform-none transform -translate-x-1/2 -translate-y-1/2">
              <Title order={3} fw={600}>
                VS
              </Title>
            </div>
          </SimpleGrid>
        </div>
        <div className="flex justify-center w-full -mt-1">
          <Card bg="teal.7" p="lg" w="100%" maw={600}>
            <Group justify="center">
              <Title order={3} fw={500} c="white">
                You in?
              </Title>
              <Button color="dark.8">Get Started</Button>
            </Group>
          </Card>
        </div>
      </Stack>
    </Container>
  );
}

export default SectionComparison;
