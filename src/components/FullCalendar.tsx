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
import { Team } from "../../prisma/generated";
import { useEvents } from "@/lib/useEvents";
import { useDisclosure } from "@mantine/hooks";
import CalendarDayDrawer from "./CalendarDayDrawer";
import { AppointmentFull, EventFull } from "@/lib/types";

interface FullCalendarProps {
  selectedTeams: Team[];
}

function FullCalendar({ selectedTeams }: FullCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const { events: eventsData, eventsLoading } =
    useEvents(
      selectedTeams.map((team) => team.id),
      format(currentDate, "yyyy-MM-dd")
    );
  const hasEventsOnDay = (date: Date) => {
    const hasAppointments = eventsData?.appointments?.some(
      (appointment) =>
        format(new Date(appointment.start), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
    );
    const hasBlockOffs = eventsData?.blockOffs?.some(
      (blockOff) =>
        format(new Date(blockOff.start), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
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
      eventsData?.blockOffs?.filter(
        (blockOff) =>
          format(new Date(blockOff.start), "yyyy-MM-dd") ===
          format(day, "yyyy-MM-dd")
      ) || []
    );
    openDayDrawer();
  }

  return (
    <Box>
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
      <CalendarDayDrawer
        opened={dayDrawerOpened}
        onClose={closeDayDrawer}
        appointments={filteredAppointments}
        blockOffs={filteredBlockOffs}
        selectedDay={selectedDay ?? undefined}
      />
    </Box>
  );
}

export default FullCalendar;

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
  const filteredAppointments = eventsData?.appointments?.filter(
    (appointment) =>
      format(new Date(appointment.start), "yyyy-MM-dd") ===
      format(day, "yyyy-MM-dd")
  );
  const filteredBlockOffs = eventsData?.blockOffs?.filter(
    (blockOff) =>
      format(new Date(blockOff.start), "yyyy-MM-dd") ===
      format(day, "yyyy-MM-dd")
  );
  const totalEvents = (filteredAppointments?.length || 0) + (filteredBlockOffs?.length || 0);
  return (
    <>
      <Text size="xs" mb="xs" truncate="end" visibleFrom="sm">
        {totalEvents}
        {totalEvents === 1
          ? " event"
          : " events"}
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
