"use client";

import { BusinessHour, EmployeeAvailability } from "../../prisma/generated";
import { useState, useEffect } from "react";
import { Checkbox, Stack, Text, Group, Button } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { AvailabilityInput } from "@/lib/types";
import { IconCopy } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function Availability({
  availability,
  onAvailabilityChange,
  label,
  businessHours,
}: {
  availability: EmployeeAvailability[];
  onAvailabilityChange: (availability: AvailabilityInput[]) => void;
  label?: React.ReactNode;
  businessHours: BusinessHour[];
}) {
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [hours, setHours] = useState<
    Record<number, { startTime: string; endTime: string }>
  >({});

  // Initialize state from availability prop only once
  useEffect(() => {
    const initialSelectedDays = availability.map((hour) => hour.dayOfWeek);
    const initialHours = availability.reduce(
      (acc, hour) => ({
        ...acc,
        [hour.dayOfWeek]: {
          startTime: hour.startTime,
          endTime: hour.endTime,
        },
      }),
      {}
    );

    setSelectedDays(initialSelectedDays);
    setHours(initialHours);
  }, [availability]);

  useEffect(() => {
    onAvailabilityChange(
      Object.entries(hours).map(([dayIndex, hour]) => ({
        dayOfWeek: parseInt(dayIndex),
        startTime: hour.startTime,
        endTime: hour.endTime,
      }))
    );
  }, [hours, onAvailabilityChange]);

  const handleDayToggle = (dayIndex: number) => {
    setSelectedDays((prev) => {
      if (prev.includes(dayIndex)) {
        const newSelected = prev.filter((d) => d !== dayIndex);
        const newHours = { ...hours };
        delete newHours[dayIndex];
        setHours(newHours);
        return newSelected;
      } else {
        return [...prev, dayIndex];
      }
    });
  };

  const handleTimeChange = (
    dayIndex: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setHours((prev) => ({
      ...prev,
      [dayIndex]: {
        ...prev[dayIndex],
        [field]: value,
      },
    }));
  };

  function handleCopyFromBusinessHours() {
    setSelectedDays(businessHours.map((hour) => hour.dayOfWeek));
    setHours(
      businessHours.reduce(
        (acc, hour) => ({
          ...acc,
          [hour.dayOfWeek]: {
            startTime: hour.openTime,
            endTime: hour.closeTime,
          },
        }),
        {}
      )
    );
    showNotification({
      title: "Copied!",
      message: "Availability copied from business hours",
      color: "teal",
      autoClose: 2000,
    });
  }

  return (
    <Stack gap="lg">
      <div>
        {label ? (
          label
        ) : (
          <div>
            <Text fw={500} size="sm" mb="sm">
              Availability
            </Text>
            <Button
              variant="default"
              size="xs"
              leftSection={<IconCopy size={14} />}
              mb="md"
              onClick={handleCopyFromBusinessHours}
            >
              Copy from business hours
            </Button>
          </div>
        )}
        <Group>
          {DAYS_OF_WEEK.map((day, index) => (
            <Checkbox
              key={day}
              label={day}
              checked={selectedDays.includes(index)}
              onChange={() => handleDayToggle(index)}
            />
          ))}
        </Group>
      </div>

      {selectedDays.length > 0 && (
        <Stack gap="md">
          {selectedDays.map((dayIndex) => (
            <Group key={dayIndex} align="flex-start">
              <Text w={100}>{DAYS_OF_WEEK[dayIndex]}</Text>
              <Group align="flex-start" wrap="nowrap" className="grow">
                <TimeInput
                  value={hours[dayIndex]?.startTime || ""}
                  onChange={(e) =>
                    handleTimeChange(
                      dayIndex,
                      "startTime",
                      e.currentTarget.value
                    )
                  }
                  label="Start"
                  size="sm"
                  className="w-1/2"
                />
                <TimeInput
                  value={hours[dayIndex]?.endTime || ""}
                  onChange={(e) =>
                    handleTimeChange(dayIndex, "endTime", e.currentTarget.value)
                  }
                  label="End"
                  size="sm"
                  minTime={hours[dayIndex]?.startTime || undefined}
                  error={
                    hours[dayIndex]?.endTime &&
                    hours[dayIndex]?.startTime &&
                    hours[dayIndex].endTime < hours[dayIndex].startTime
                      ? "End time must be after start time"
                      : undefined
                  }
                  className="w-1/2"
                />
              </Group>
            </Group>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export default Availability;
