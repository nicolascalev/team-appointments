"use client";

import { TeamMember, User } from "../../prisma/generated";
import MembersToggle from "./MembersToggle";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

function BookingServiceMembersToggle({
  members,
  defaultSelectedMembers,
  withUrlSearchParams = true,
  onChange,
}: {
  members: (TeamMember & { user: User })[];
  defaultSelectedMembers: (TeamMember & { user: User })[];
  onChange?: (newSelectedMembers: (TeamMember & { user: User })[]) => void;
  withUrlSearchParams?: boolean;
}) {
  const searchParams = useSearchParams();
  const [selectedMembers, setSelectedMembers] = useState<
    (TeamMember & { user: User })[]
  >(() => {
    // Get member IDs from URL
    const memberIds = searchParams?.get("members")?.split(",") || [];

    // If we have member IDs in URL, filter members by those IDs
    if (memberIds.length > 0) {
      return members.filter((member) => memberIds.includes(member.id));
    }

    // Otherwise use defaultSelectedMembers or all members if no default
    return defaultSelectedMembers.length > 0 ? defaultSelectedMembers : members;
  });

  const handleMembersChange = (
    newSelectedMembers: (TeamMember & { user: User })[]
  ) => {
    setSelectedMembers(newSelectedMembers);

    if (withUrlSearchParams) {
      // Get current URL and its search params
      const url = new URL(window.location.href);
      const searchParams = new URLSearchParams(url.search);

      // Update or remove the members parameter
      if (newSelectedMembers.length > 0) {
        searchParams.set(
          "members",
          newSelectedMembers.map((m) => m.id).join(",")
        );
      } else {
        searchParams.delete("members");
      }

      // Update URL while preserving all other search params
      window.history.replaceState(
        {},
        "",
        `${url.pathname}?${searchParams.toString()}`
      );

      // Dispatch custom event to notify other components of URL change
      window.dispatchEvent(new CustomEvent("urlUpdated"));
    }

    onChange?.(newSelectedMembers);
  };

  return (
    <MembersToggle
      members={members}
      defaultSelectedMembers={selectedMembers}
      onChange={handleMembersChange}
    />
  );
}

export default BookingServiceMembersToggle;
