import { fetcherSimple } from "./fetchers";
import useSWR from "swr";

type UseSlotsParams = {
  teamSlug: string;
  serviceId: string;
  date?: string;
  employeeIds?: string[];
};

export function useSlots({ teamSlug, serviceId, date, employeeIds }: UseSlotsParams) {
  // Build the query string
  const queryParams = new URLSearchParams();
  queryParams.set('serviceId', serviceId);
  if (date) queryParams.set('date', date);
  if (employeeIds && employeeIds.length > 0) queryParams.set('employeeIds', employeeIds.join(','));

  const url = `/api/slots/${teamSlug}?${queryParams.toString()}`;
  
  // Create a key that includes all parameters to ensure SWR re-fetches when any parameter changes
  const key = teamSlug && serviceId ? url : null;
  
  const { data, error, isLoading, mutate } = useSWR<{ data: string[] }>(
    key,
    fetcherSimple,
    {
      // Revalidate when the window gains focus
      revalidateOnFocus: true,
      // Revalidate when the network reconnects
      revalidateOnReconnect: true,
    }
  );

  return {
    slots: data?.data || [],
    slotsError: error,
    slotsLoading: isLoading,
    revalidateSlots: mutate,
  };
}
