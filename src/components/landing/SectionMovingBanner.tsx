import { Card, Group, Text, ThemeIcon } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

function SectionMovingBanner() {
  return (
    <Card
      bg="dark.9"
      py="md"
      radius={0}
      maw="100dvw"
      style={{ overflow: "hidden" }}
    >
      <Group
        wrap="nowrap"
        align="center"
        style={{
          animation: "scroll-left-to-right 20s linear infinite",
          // width: "fit-content"
        }}
      >
        <ThemeIcon color="teal" size="xl">
          <IconCheck size={24} />
        </ThemeIcon>
        <Text c="white" fw={500} size="24px" style={{ whiteSpace: "nowrap" }}>
          Teamlypro is a platform that helps you manage your team.
        </Text>
        <ThemeIcon color="teal" size="xl">
          <IconCheck size={24} />
        </ThemeIcon>
        <Text c="white" fw={500} size="24px" style={{ whiteSpace: "nowrap" }}>
          Teamlypro is a platform that helps you manage your team.
        </Text>
        <ThemeIcon color="teal" size="xl">
          <IconCheck size={24} />
        </ThemeIcon>
        <Text c="white" fw={500} size="24px" style={{ whiteSpace: "nowrap" }}>
          Teamlypro is a platform that helps you manage your team.
        </Text>
        <ThemeIcon color="teal" size="xl">
          <IconCheck size={24} />
        </ThemeIcon>
        <Text c="white" fw={500} size="24px" style={{ whiteSpace: "nowrap" }}>
          Teamlypro is a platform that helps you manage your team.
        </Text>
        <ThemeIcon color="teal" size="xl">
          <IconCheck size={24} />
        </ThemeIcon>
        <Text c="white" fw={500} size="24px" style={{ whiteSpace: "nowrap" }}>
          Teamlypro is a platform that helps you manage your team.
        </Text>
      </Group>
    </Card>
  );
}

export default SectionMovingBanner;
