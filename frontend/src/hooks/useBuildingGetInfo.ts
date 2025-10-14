import { useQuery } from "@tanstack/react-query";
import { fetchBuildingGetInfo } from "../services/buildingService";

export function useBuildingGetInfo(cityId: number) {
  return useQuery({
    queryKey: ["buildingGetInfo", cityId],
    queryFn: () => fetchBuildingGetInfo({cityId}),
    enabled: !!cityId
  });
}