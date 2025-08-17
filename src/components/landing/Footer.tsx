import { Anchor, Box, Container, Group, Text } from "@mantine/core";
import React from "react";

function Footer() {
  const linkStyles = {
    root: {
      display: "block",
    },
  };

  return (
    <Box bg="dark.9">
      <Container size="xl" py="2rem">
        <div className="flex justify-between flex-wrap gap-y-4 gap-x-4">
          <Text c="white" fw={500} fs="lg" w={{ base: "100%", xs: "auto" }} className="grow">
            Teamlypro
          </Text>
          <Group gap="xs">
            <div className="min-w-[100px]">
              <Text c="white" fw={500} mb="sm">
                Product
              </Text>
              <Anchor c="dimmed" href="#" styles={linkStyles}>
                Product
              </Anchor>
              <Anchor c="dimmed" href="#" styles={linkStyles}>
                Product
              </Anchor>
              <Anchor c="dimmed" href="#" styles={linkStyles}>
                Product
              </Anchor>
            </div>
            <div className="min-w-[100px]">
              <Text c="white" fw={500} mb="sm">
                Legal
              </Text>
              <Anchor c="dimmed" href="#" styles={linkStyles}>
                Product
              </Anchor>
              <Anchor c="dimmed" href="#" styles={linkStyles}>
                Product
              </Anchor>
              <Anchor c="dimmed" href="#" styles={linkStyles}>
                Product
              </Anchor>
            </div>
            <div className="min-w-[100px]">
              <Text c="white" fw={500} mb="sm">
                Contact
              </Text>
              <Anchor c="dimmed" href="#" styles={linkStyles}>
                Product
              </Anchor>
              <Anchor c="dimmed" href="#" styles={linkStyles}>
                Product
              </Anchor>
              <Anchor c="dimmed" href="#" styles={linkStyles}>
                Product
              </Anchor>
            </div>
          </Group>
        </div>
      </Container>
    </Box>
  );
}

export default Footer;
