import { useQuery } from "@tanstack/react-query";
import { fetchBuilding } from "../services/buildingService";

export function useGetBuildings(cityId: number) {
  return useQuery({
    queryKey: ["buildings", cityId],
    queryFn: () => fetchBuilding({cityId}),
    enabled: !!cityId
  });
}