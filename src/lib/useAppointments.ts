import { fetcherWithArgs } from "./fetchers";
import useSWR from "swr";
import { AppointmentFull } from "./types";

export function useAppointments(teams: string[], date: string) {
  const { data, error, isLoading, mutate } = useSWR<{
    data: AppointmentFull[];
  }>(
    teams && teams.length > 0 && date
      ? [`/api/appointments`, { teams, date }]
      : null,
    ([url, params]) => fetcherWithArgs(url, params as Record<string, string>)
  );

  return {
    appointments: data?.data,
    appointmentsError: error,
    appointmentsLoading: isLoading,
    revalidateAppointments: mutate,
  };
}
