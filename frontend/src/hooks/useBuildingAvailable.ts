import { useQuery } from "@tanstack/react-query";
import { fetchBuildingAvailable } from "../services/buildingService";
import { useUserStore } from "../store/userStore";

export function useBuildingAvailable(position: number) {
    const { cityId } = useUserStore();
    return useQuery({
        queryKey: ["buildingAvailable", cityId, position],
        queryFn: () => fetchBuildingAvailable({ cityId, position }),
        enabled: position > 0
    });
}