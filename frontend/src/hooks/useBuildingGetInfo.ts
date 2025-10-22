import { useQuery } from "@tanstack/react-query";
import { fetchBuildingGetInfo } from "../services/buildingService";
import { REQUEST_CACHE_TIME } from "../config";

export function useBuildingGetInfo(cityId: number) {
  return useQuery({
    queryKey: ["buildingGetInfo", cityId],
    queryFn: () => fetchBuildingGetInfo({cityId}),
    enabled: !!cityId,
    staleTime: REQUEST_CACHE_TIME
  });
}