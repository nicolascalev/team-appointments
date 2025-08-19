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
import { useAppointments } from "@/lib/useAppointments";
import { useDisclosure } from "@mantine/hooks";
import CalendarDayDrawer from "./CalendarDayDrawer";
import { AppointmentFull } from "@/lib/types";

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

  const { appointments: appointmentsData, appointmentsLoading } =
    useAppointments(
      selectedTeams.map((team) => team.id),
      format(currentDate, "yyyy-MM-dd")
    );
  const hasEventsOnDay = (date: Date) => {
    return appointmentsData?.some(
      (appointment) =>
        format(new Date(appointment.start), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
    );
  };

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [filteredAppointments, setFilteredAppointments] = useState<
    AppointmentFull[]
  >([]);
  const [dayDrawerOpened, { open: openDayDrawer, close: closeDayDrawer }] =
    useDisclosure(false);
  function handleDayClick(day: Date) {
    setSelectedDay(day);
    setFilteredAppointments(
      appointmentsData?.filter(
        (appointment) =>
          format(new Date(appointment.start), "yyyy-MM-dd") ===
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
          visible={appointmentsLoading}
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
                appointmentsData={appointmentsData}
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
        selectedDay={selectedDay ?? undefined}
      />
    </Box>
  );
}

export default FullCalendar;

function Day({
  day,
  appointmentsData,
  handleDayClick,
}: {
  day: Date;
  appointmentsData?: AppointmentFull[];
  handleDayClick: (day: Date) => void;
}) {
  const filteredAppointments = appointmentsData?.filter(
    (appointment) =>
      format(new Date(appointment.start), "yyyy-MM-dd") ===
      format(day, "yyyy-MM-dd")
  );
  return (
    <>
      <Text size="xs" mb="xs" truncate="end" visibleFrom="sm">
        {filteredAppointments?.length}
        {filteredAppointments?.length === 1 ? " event" : " events"}
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
