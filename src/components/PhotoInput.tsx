"use client";

import { Button, Group } from "@mantine/core";
import { Avatar } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import { ChangeEvent, useState } from "react";

interface PhotoInputProps {
  defaultSrc?: string;
  buttonLabel?: string;
  onChange?: (file: File) => void;
}

function PhotoInput({ defaultSrc, buttonLabel = "Upload photo", onChange }: PhotoInputProps) {
  const [preview, setPreview] = useState<string | null>(defaultSrc || null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange?.(file);
    }
  };

  return (
    <Group wrap="nowrap">
      <Avatar src={preview} />
      <Button
        variant="default"
        rightSection={<IconUpload size={14} />}
        size="sm"
        component="label"
      >
        {buttonLabel}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </Button>
    </Group>
  );
}

export default PhotoInput;
