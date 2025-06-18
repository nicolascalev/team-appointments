"use client";

import { Select } from "@mantine/core";
import { use } from "react";
import { addMinutes, isAfter } from "date-fns";
import { BookingService } from "@/lib/types";

function BookingServiceSlots({
  slots,
  service,
}: {
  slots: Promise<string[]>;
  service: BookingService;
}) {
  const slotsData = use(slots);
  const slotsDataFormatted = slotsData.map((slot) => ({
    value: slot,
    label: new Date(slot).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  }));

  const minNotice = service.team.settings?.minBookingNoticeMinutes ?? 5;
  const now = new Date();
  const minNoticeDate = addMinutes(now, minNotice);
  
  const slotsDataFiltered = slotsDataFormatted.filter((slot) => {
    return isAfter(slot.value, minNoticeDate);
  });

  console.log({ minNoticeDate, slotsData });

  return (
    <Select
      label="Slot"
      placeholder="Select a slot"
      maw={{ sm: 300 }}
      data={slotsDataFiltered}
    />
  );
}

export default BookingServiceSlots;
