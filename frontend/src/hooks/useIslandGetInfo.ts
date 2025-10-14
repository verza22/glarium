import { useQuery } from "@tanstack/react-query";
import { fetchIslandGetInfo } from "../services/islandService";

export function useIslandGetInfo(islandId: number) {
  return useQuery({
    queryKey: ["islandGetInfo", islandId],
    queryFn: () => fetchIslandGetInfo({islandId}),
    enabled: !!islandId
  });
}