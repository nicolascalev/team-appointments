"use client";
import {
  ActionIcon,
  Anchor,
  Box,
  Card,
  Group,
  LoadingOverlay,
  Text,
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isToday,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useState } from "react";
import { useTeamMemberEvents } from "@/lib/useEvents";
import { useDisclosure } from "@mantine/hooks";
import AdminCalendarDayDrawer from "./AdminCalendarDayDrawer";
import { AppointmentFull, EventFull, TeamMemberWithUser } from "@/lib/types";
import BookingServiceMembersToggle from "./BookingServiceMembersToggle";

interface FullCalendarAdminProps {
  members: TeamMemberWithUser[];
}

function FullCalendarAdmin({ members }: FullCalendarAdminProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMembers, setSelectedMembers] = useState<TeamMemberWithUser[]>(
    []
  );

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of the week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = monthStart.getDay();

  // Create empty cells for the days before the first day of the month
  const emptyCells = Array.from({ length: firstDayOfWeek }, () => null);

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const { events: eventsData, eventsLoading } = useTeamMemberEvents(
    selectedMembers.map((member) => member.id),
    format(currentDate, "yyyy-MM-dd")
  );

  // Helper function to check if a date falls within a block off range
  const isDateInBlockOffRange = (date: Date, blockOff: EventFull) => {
    const blockOffStart = new Date(blockOff.start);
    const blockOffEnd = new Date(blockOff.end);
    const checkDate = new Date(date);

    // Set time to start of day for comparison
    checkDate.setHours(0, 0, 0, 0);
    blockOffStart.setHours(0, 0, 0, 0);
    blockOffEnd.setHours(0, 0, 0, 0);

    return checkDate >= blockOffStart && checkDate <= blockOffEnd;
  };

  const hasEventsOnDay = (date: Date) => {
    const hasAppointments = eventsData?.appointments?.some(
      (appointment) =>
        format(new Date(appointment.start), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
    );
    const hasBlockOffs = eventsData?.blockOffs?.some((blockOff) =>
      isDateInBlockOffRange(date, blockOff)
    );
    return hasAppointments || hasBlockOffs;
  };

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [filteredAppointments, setFilteredAppointments] = useState<
    AppointmentFull[]
  >([]);
  const [dayDrawerOpened, { open: openDayDrawer, close: closeDayDrawer }] =
    useDisclosure(false);
  const [filteredBlockOffs, setFilteredBlockOffs] = useState<EventFull[]>([]);

  function handleDayClick(day: Date) {
    setSelectedDay(day);
    setFilteredAppointments(
      eventsData?.appointments?.filter(
        (appointment) =>
          format(new Date(appointment.start), "yyyy-MM-dd") ===
          format(day, "yyyy-MM-dd")
      ) || []
    );
    setFilteredBlockOffs(
      eventsData?.blockOffs?.filter((blockOff) =>
        isDateInBlockOffRange(day, blockOff)
      ) || []
    );
    openDayDrawer();
  }

  const handleMembersChange = (newSelectedMembers: TeamMemberWithUser[]) => {
    setSelectedMembers(newSelectedMembers);
  };

  return (
    <Box>
      <div className="mb-4">
        <Text fw={500} size="sm" mb="xs">
          Filter by Team Members
        </Text>
        <BookingServiceMembersToggle
          members={members as TeamMemberWithUser[]}
          defaultSelectedMembers={selectedMembers as TeamMemberWithUser[]}
          onChange={handleMembersChange}
          withUrlSearchParams={false}
        />
      </div>
      <div className="flex items-center justify-between sm:justify-normal gap-4 mb-4">
        <Text fw={500}>{format(currentDate, "MMMM yyyy")}</Text>
        <div className="flex items-center gap-2">
          <ActionIcon variant="light" onClick={previousMonth} color="gray">
            <IconChevronLeft size={14} />
          </ActionIcon>
          <ActionIcon variant="light" onClick={nextMonth} color="gray">
            <IconChevronRight size={14} />
          </ActionIcon>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0 relative">
        <LoadingOverlay
          visible={eventsLoading}
          zIndex={10}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-medium p-2">
            {day}
          </div>
        ))}

        {emptyCells.map((_, index) => (
          <Card
            key={`empty-${index}`}
            radius="none"
            className="min-h-[80px]"
            bg="transparent"
            withBorder
          >
            {/* Empty cell */}
          </Card>
        ))}
        {days.map((day) => (
          <Card
            withBorder
            key={day.toString()}
            radius="none"
            className={`min-h-[80px]`}
          >
            <div className="text-sm mb-1">
              {isToday(day) ? (
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white -ms-1.5 -mt-1.5">
                  {format(day, "d")}
                </span>
              ) : (
                format(day, "d")
              )}
            </div>
            {hasEventsOnDay(day) && (
              <Day
                day={day}
                eventsData={eventsData}
                handleDayClick={handleDayClick}
              />
            )}
          </Card>
        ))}
      </div>
      <AdminCalendarDayDrawer
        opened={dayDrawerOpened}
        onClose={closeDayDrawer}
        appointments={filteredAppointments}
        blockOffs={filteredBlockOffs}
        selectedDay={selectedDay ?? undefined}
      />
    </Box>
  );
}

export default FullCalendarAdmin;

function Day({
  day,
  eventsData,
  handleDayClick,
}: {
  day: Date;
  eventsData?: {
    appointments: AppointmentFull[];
    blockOffs: EventFull[];
  };
  handleDayClick: (day: Date) => void;
}) {
  // Helper function to check if a date falls within a block off range
  const isDateInBlockOffRange = (date: Date, blockOff: EventFull) => {
    const blockOffStart = new Date(blockOff.start);
    const blockOffEnd = new Date(blockOff.end);
    const checkDate = new Date(date);

    // Set time to start of day for comparison
    checkDate.setHours(0, 0, 0, 0);
    blockOffStart.setHours(0, 0, 0, 0);
    blockOffEnd.setHours(0, 0, 0, 0);

    return checkDate >= blockOffStart && checkDate <= blockOffEnd;
  };

  const filteredAppointments = eventsData?.appointments?.filter(
    (appointment) =>
      format(new Date(appointment.start), "yyyy-MM-dd") ===
      format(day, "yyyy-MM-dd")
  );
  const filteredBlockOffs = eventsData?.blockOffs?.filter((blockOff) =>
    isDateInBlockOffRange(day, blockOff)
  );
  const totalEvents =
    (filteredAppointments?.length || 0) + (filteredBlockOffs?.length || 0);
  return (
    <>
      <Text size="xs" mb="xs" truncate="end" visibleFrom="sm">
        {totalEvents}
        {totalEvents === 1 ? " event" : " events"}
      </Text>
      <Group
        wrap="nowrap"
        visibleFrom="sm"
        gap="2"
        onClick={() => handleDayClick(day)}
      >
        <Anchor size="xs">Events</Anchor>
        <IconChevronRight size={12} color="var(--mantine-color-indigo-6)" />
      </Group>
      <ActionIcon
        variant="light"
        size="xs"
        hiddenFrom="sm"
        mt="xs"
        onClick={() => handleDayClick(day)}
      >
        <IconChevronRight size={14} />
      </ActionIcon>
    </>
  );
}
