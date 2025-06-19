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
    
    // Dispatch custom event to notify other components of URL change
    window.dispatchEvent(new CustomEvent('urlUpdated'));
  };

  return (
    <DateInput
      label="Date"
      placeholder="Select a date"
      minDate={minDate}
      value={selectedDate}
      highlightToday
      onChange={handleDateChange}
      excludeDate={(date) => {
        // Parse date string manually to avoid timezone issues
        // DateInput typically passes dates in YYYY-MM-DD format
        const [year, month, day] = date.split('-').map(Number);
        const parsedDate = new Date(year, month - 1, day); // month is 0-indexed in JS Date
        const dayOfWeek = parsedDate.getDay();
        const isExcluded = !businessHours.some((hour) => hour.dayOfWeek === dayOfWeek);
        return isExcluded;
      }}
      weekendDays={[]}
      valueFormat="dddd MMM D, YYYY"
    />
  );
}

export default BookingServiceDateInput;
