"use client";

import { TeamMember, User } from "../../prisma/generated";
import MembersToggle from "./MembersToggle";
import { useState } from "react";

function BookingServiceMembersToggle({
  members,
  defaultSelectedMembers,
}: {
  members: (TeamMember & { user: User })[];
  defaultSelectedMembers: (TeamMember & { user: User })[];
}) {
  const [selectedMembers, setSelectedMembers] = useState<(TeamMember & { user: User })[]>(() => {
    // Get member IDs from URL
    const searchParams = new URLSearchParams(window.location.search);
    const memberIds = searchParams.get('members')?.split(',') || [];
    
    // If we have member IDs in URL, filter members by those IDs
    if (memberIds.length > 0) {
      return members.filter(member => memberIds.includes(member.id));
    }
    
    // Otherwise use defaultSelectedMembers or all members if no default
    return defaultSelectedMembers.length > 0 ? defaultSelectedMembers : members;
  });

  const handleMembersChange = (newSelectedMembers: (TeamMember & { user: User })[]) => {
    setSelectedMembers(newSelectedMembers);
    
    // Get current URL and its search params
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    
    // Update or remove the members parameter
    if (newSelectedMembers.length > 0) {
      searchParams.set('members', newSelectedMembers.map(m => m.id).join(','));
    } else {
      searchParams.delete('members');
    }
    
    // Update URL while preserving all other search params
    window.history.replaceState({}, '', `${url.pathname}?${searchParams.toString()}`);
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
