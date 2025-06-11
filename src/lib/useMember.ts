import { fetcherSimple } from "./fetchers";
import useSWR from "swr";
import { TeamMemberFull } from "./types";


export function useMember(memberId: string) {
  const { data, error, isLoading, mutate } = useSWR<{ data: TeamMemberFull }>(`/api/member/${memberId}`, fetcherSimple);

  return {
    member: data?.data,
    memberError: error,
    memberLoading: isLoading,
    revalidateMember: mutate,
  }
}