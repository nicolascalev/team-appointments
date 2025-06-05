"use client";

import { BusinessHour } from "../../prisma/generated";
import { useState, useEffect } from "react";
import { Checkbox, Stack, Text, Group } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { CreateManyBusinessHoursInput } from "@/lib/types";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function BusinessHours({
  businessHours,
  onBusinessHoursChange,
}: {
  businessHours: BusinessHour[];
  onBusinessHoursChange: (businessHours: CreateManyBusinessHoursInput) => void;
}) {
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [hours, setHours] = useState<
    Record<number, { openTime: string; closeTime: string }>
  >({});

  useEffect(() => {
    // Initialize state from businessHours prop
    const initialSelectedDays = businessHours.map((hour) => hour.dayOfWeek);
    const initialHours = businessHours.reduce(
      (acc, hour) => ({
        ...acc,
        [hour.dayOfWeek]: {
          openTime: hour.openTime,
          closeTime: hour.closeTime,
        },
      }),
      {}
    );

    setSelectedDays(initialSelectedDays);
    setHours(initialHours);
  }, [businessHours]);

  useEffect(() => {
    onBusinessHoursChange(
      Object.entries(hours).map(([dayIndex, hour]) => ({
        dayOfWeek: parseInt(dayIndex),
        openTime: hour.openTime,
        closeTime: hour.closeTime,
      }))
    );
  }, [hours, onBusinessHoursChange]);

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
    field: "openTime" | "closeTime",
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

  return (
    <Stack gap="lg">
      <div>
        <Text fw={500} mb="md">
          Days open
        </Text>
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
                  value={hours[dayIndex]?.openTime || ""}
                  onChange={(e) =>
                    handleTimeChange(
                      dayIndex,
                      "openTime",
                      e.currentTarget.value
                    )
                  }
                  label="Open"
                  size="sm"
                  className="w-1/2"
                />
                <TimeInput
                  value={hours[dayIndex]?.closeTime || ""}
                  onChange={(e) =>
                    handleTimeChange(
                      dayIndex,
                      "closeTime",
                      e.currentTarget.value
                    )
                  }
                  label="Close"
                  size="sm"
                  minTime={hours[dayIndex]?.openTime || undefined}
                  error={
                    hours[dayIndex]?.closeTime &&
                    hours[dayIndex]?.openTime &&
                    hours[dayIndex].closeTime < hours[dayIndex].openTime
                      ? "Close time must be after open time"
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

export default BusinessHours;
