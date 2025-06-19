"use client";

import { Loader, Select } from "@mantine/core";
import { addMinutes, isAfter } from "date-fns";
import { BookingService } from "@/lib/types";
import { useSlots } from "@/lib/useSlots";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface BookingServiceSlotsProps {
  service: BookingService;
  onSlotChange?: (slot: string | null) => void;
  selectedSlot?: string | null;
  onSlotsChange?: (slots: string[]) => void;
  onLoadingChange?: (loading: boolean) => void;
}

function BookingServiceSlots({ 
  service, 
  onSlotChange,
  selectedSlot: externalSelectedSlot,
  onSlotsChange,
  onLoadingChange
}: BookingServiceSlotsProps) {
  const params = useParams();
  const teamSlug = params.slug as string;

  // Internal state for selected slot
  const [internalSelectedSlot, setInternalSelectedSlot] = useState<string | null>(null);
  
  // Use external selected slot if provided, otherwise use internal state
  const selectedSlot = externalSelectedSlot !== undefined ? externalSelectedSlot : internalSelectedSlot;

  // State to track URL parameters
  const [urlParams, setUrlParams] = useState({
    date: undefined as string | undefined,
    employeeIds: undefined as string[] | undefined,
  });

  // Ref to track previous slots to avoid unnecessary updates
  const previousSlotsRef = useRef<string[]>([]);

  // Update URL parameters when they change
  useEffect(() => {
    const updateParams = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const date = searchParams.get("date") || undefined;
      const members = searchParams.get("members");
      const employeeIds = members ? members.split(",") : undefined;

      setUrlParams({ date, employeeIds });
    };

    // Initial update
    updateParams();

    // Listen for URL changes
    const handleUrlChange = () => updateParams();
    window.addEventListener("popstate", handleUrlChange);

    // Custom event for URL updates (from our components)
    const handleUrlUpdate = () => updateParams();
    window.addEventListener("urlUpdated", handleUrlUpdate);

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("urlUpdated", handleUrlUpdate);
    };
  }, []);

  const { slots, slotsLoading, slotsError } = useSlots({
    teamSlug,
    serviceId: service.id,
    date: urlParams.date,
    employeeIds: urlParams.employeeIds,
  });

  useEffect(() => {
    onLoadingChange?.(slotsLoading);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotsLoading]);

  // Handle slot selection
  const handleSlotChange = (value: string | null) => {
    if (externalSelectedSlot !== undefined) {
      // Controlled component - notify parent
      onSlotChange?.(value);
    } else {
      // Uncontrolled component - update internal state
      setInternalSelectedSlot(value);
    }
  };

  // Notify parent when slots change (only if they actually changed)
  useEffect(() => {
    if (onSlotsChange && JSON.stringify(slots) !== JSON.stringify(previousSlotsRef.current)) {
      previousSlotsRef.current = slots;
      onSlotsChange(slots);
    }
  }, [slots, onSlotsChange]);

  if (slotsError) {
    return <div>Error loading slots: {slotsError.message}</div>;
  }

  const slotsDataFormatted = slots.map((slot) => ({
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

  return (
    <Select
      label="Slot"
      placeholder="Select a slot"
      disabled={slotsLoading || slotsDataFiltered.length === 0}
      rightSection={slotsLoading ? <Loader size="xs" color="blue" /> : undefined}
      data={slotsDataFiltered}
      value={selectedSlot}
      onChange={handleSlotChange}
    />
  );
}

export default BookingServiceSlots;
