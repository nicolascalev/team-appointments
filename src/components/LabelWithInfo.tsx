import {
  ActionIcon,
  Group,
  Popover,
  PopoverDropdown,
  PopoverTarget,
  Text,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

function LabelWithInfo({ label, info }: { label: string; info: string }) {
  return (
    <Group wrap="nowrap" gap={4} align="flex-start">
      <Text size="sm">{label}</Text>
      <Popover width={300} position="bottom" withArrow shadow="md">
        <PopoverTarget>
          <ActionIcon variant="subtle" color="gray" size="sm">
            <IconInfoCircle size={14} />
          </ActionIcon>
        </PopoverTarget>
        <PopoverDropdown>
          <Text size="xs">{info}</Text>
        </PopoverDropdown>
      </Popover>
    </Group>
  );
}

export default LabelWithInfo;
