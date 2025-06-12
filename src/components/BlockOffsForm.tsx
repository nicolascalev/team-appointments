"use client";
import {
  ActionIcon,
  Button,
  Group,
  SimpleGrid,
  Stack,
  Textarea,
  Text,
} from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { DateTimePicker } from "@mantine/dates";
import { BlockOff } from "@/lib/types";

function BlockOffsForm({ onChange }: { onChange: (data: BlockOff[]) => void }) {
  const [blockOffs, setBlockOffs] = useState<string[]>([]);
  const [blockOffsData, setBlockOffsData] = useState<
    {
      id: string;
      start: string | null;
      end: string | null;
      reason: string;
    }[]
  >([]);

  function deleteBlockOff(id: string) {
    setBlockOffs(blockOffs.filter((b) => b !== id));
    setBlockOffsData(blockOffsData.filter((b) => b.id !== id));
  }

  function updateBlockOff(data: {
    id: string;
    start: string | null;
    end: string | null;
    reason: string;
  }) {
    setBlockOffsData((prev) => {
      const exists = prev.some((b) => b.id === data.id);
      if (exists) {
        return prev.map((b) => (b.id === data.id ? data : b));
      }
      return [...prev, data];
    });
  }

  useEffect(() => {
    const validBlockOffs = blockOffsData.filter(
      (block) =>
        block.start &&
        block.end &&
        new Date(block.start).getTime() < new Date(block.end).getTime()
    );
    onChange(validBlockOffs as BlockOff[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockOffsData]);

  return (
    <Stack>
      {blockOffs.map((block) => (
        <SingleBlockOffForm
          key={block}
          onDelete={() => deleteBlockOff(block)}
          onChange={(data) =>
            updateBlockOff({
              id: block,
              start: data.start,
              end: data.end,
              reason: data.reason,
            })
          }
        />
      ))}
      <div>
        <Button
          variant="default"
          size="xs"
          leftSection={<IconPlus size={14} />}
          onClick={() => setBlockOffs([...blockOffs, randomId()])}
        >
          Add block off
        </Button>
      </div>
    </Stack>
  );
}

export default BlockOffsForm;

function SingleBlockOffForm({
  onDelete,
  onChange,
}: {
  onDelete: () => void;
  onChange: (data: {
    start: string | null;
    end: string | null;
    reason: string;
  }) => void;
}) {
  const [start, setStart] = useState<string | null>(null);
  const [end, setEnd] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const now = new Date();

  useEffect(() => {
    onChange({
      start,
      end,
      reason,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end, reason]);

  return (
    <Stack gap="xs">
      <Group justify="space-between" align="center">
        <Text size="sm" fw={500}>
          Block off
        </Text>
        <ActionIcon variant="subtle" color="red" onClick={onDelete}>
          <IconTrash size={14} />
        </ActionIcon>
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <DateTimePicker
          label="Start"
          value={start}
          onChange={setStart}
          minDate={now}
          timePickerProps={{
            withDropdown: true,
            popoverProps: { withinPortal: false },
            format: "12h",
          }}
        />
        <DateTimePicker
          label="End"
          value={end}
          onChange={setEnd}
          minDate={now}
          error={
            end && start && new Date(end) < new Date(start)
              ? "End date must be after start date"
              : null
          }
          timePickerProps={{
            withDropdown: true,
            popoverProps: { withinPortal: false },
            format: "12h",
          }}
        />
      </SimpleGrid>
      <Textarea
        label="Reason"
        autosize
        minRows={2}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
    </Stack>
  );
}
