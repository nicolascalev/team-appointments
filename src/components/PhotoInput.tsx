"use client";

import { Button, Group } from "@mantine/core";
import { Avatar } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import { ChangeEvent, useState } from "react";
import { showNotification } from "@mantine/notifications";
import imageCompression from "browser-image-compression";

interface PhotoInputProps {
  defaultSrc?: string;
  buttonLabel?: string;
  onChange?: (file: File) => void;
}

function PhotoInput({
  defaultSrc,
  buttonLabel = "Upload photo",
  onChange,
}: PhotoInputProps) {
  const [preview, setPreview] = useState<string | null>(defaultSrc || null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setIsCompressing(true);

        // Compression options
        const options = {
          maxSizeMB: 0.95,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        // Compress the image
        const compressedFile = await imageCompression(file, options);

        // Create a preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(compressedFile);

        // Pass the compressed file to the parent component
        onChange?.(compressedFile);

        // Show success notification if the file was significantly compressed
        if (file.size > compressedFile.size * 1.5) {
          showNotification({
            title: "Success",
            message: `Image compressed from ${(file.size / 1024 / 1024).toFixed(
              1
            )}MB to ${(compressedFile.size / 1024 / 1024).toFixed(1)}MB`,
            color: "teal",
          });
        }
      } catch (error) {
        showNotification({
          title: "Error",
          message: "Failed to process image. Please try again.",
          color: "red",
        });
        console.error("Error compressing image:", error);
      } finally {
        setIsCompressing(false);
      }
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
        loading={isCompressing}
      >
        {buttonLabel}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
          disabled={isCompressing}
        />
      </Button>
    </Group>
  );
}

export default PhotoInput;
