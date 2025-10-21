import { fetcherWithArgs } from "./fetchers";
import useSWR from "swr";
import { AppointmentFull, EventFull } from "./types";

export function useEvents(teams: string[], date: string) {
  const { data, error, isLoading, mutate } = useSWR<{
    data: {
      appointments: AppointmentFull[];
      blockOffs: EventFull[];
    };
  }>(
    teams && teams.length > 0 && date
      ? [`/api/events`, { teams, date }]
      : null,
    ([url, params]) => fetcherWithArgs(url, params as Record<string, string>)
  );

  return {
    events: data?.data,
    eventsError: error,
    eventsLoading: isLoading,
    revalidateEvents: mutate,
  };
}

export function useTeamMemberEvents(teamMembers: string[], date: string) {
  const { data, error, isLoading, mutate } = useSWR<{
    data: {
      appointments: AppointmentFull[];
      blockOffs: EventFull[];
    };
  }>(
    teamMembers && teamMembers.length > 0 && date
      ? [`/api/events-members`, { teamMembers, date }]
      : null,
    ([url, params]) => fetcherWithArgs(url, params as Record<string, string>)
  );

  return {
    events: data?.data,
    eventsError: error,
    eventsLoading: isLoading,
    revalidateEvents: mutate,
  };
}
