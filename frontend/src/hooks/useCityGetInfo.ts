import { useQuery } from "@tanstack/react-query";
import { fetchCityGetInfo } from "../services/cityService";

export function useCityGetInfo(cityId: number) {
  return useQuery({
    queryKey: ["user", cityId],
    queryFn: () => fetchCityGetInfo({cityId}),
    enabled: !!cityId
  });
}