"use client";
import { DateInput } from "@mantine/dates";
import React from "react";
import { BusinessHour } from "../../prisma/generated/client";

function BookingServiceDateInput({
  minDate,
  businessHours,
}: {
  minDate: Date;
  businessHours: BusinessHour[];
}) {
  const handleDateChange = (date: string | null) => {
    if (date) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('date', date);
      window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
    }
  };

  return (
    <DateInput
      label="Date"
      placeholder="Select a date"
      maw={{ sm: 300 }}
      minDate={minDate}
      defaultDate={minDate}
      highlightToday
      onChange={handleDateChange}
      excludeDate={(date) => {
        const dayOfWeek = new Date(date).getDay();
        return !businessHours.some((hour) => hour.dayOfWeek === dayOfWeek);
      }}
      weekendDays={[]}
    />
  );
}

export default BookingServiceDateInput;
