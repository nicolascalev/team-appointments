"use client";
import { DateInput } from "@mantine/dates";
import React, { useState } from "react";
import { BusinessHour } from "../../prisma/generated/client";

function BookingServiceDateInput({
  minDate,
  businessHours,
}: {
  minDate: Date;
  businessHours: BusinessHour[];
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('date') || null;
  });

  const handleDateChange = (date: string | null) => {
    setSelectedDate(date);
    
    // Get current URL and its search params
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    
    // Update or remove the date parameter
    if (date) {
      searchParams.set('date', date);
    } else {
      searchParams.delete('date');
    }
    
    // Update URL while preserving all other search params
    window.history.replaceState({}, '', `${url.pathname}?${searchParams.toString()}`);
  };

  return (
    <DateInput
      label="Date"
      placeholder="Select a date"
      maw={{ sm: 300 }}
      minDate={minDate}
      value={selectedDate}
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
