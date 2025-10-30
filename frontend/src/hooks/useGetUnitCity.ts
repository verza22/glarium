import { useQuery } from "@tanstack/react-query";
import { unitCity } from "../services/unitService";
import { REQUEST_CACHE_TIME } from "../config";
import { useUserStore } from "../store/userStore";

export function useGetUnitCity() {
    const cityId = useUserStore(state=> state.cityId);
    return useQuery({
        queryKey: ["useGetUnitCity"],
        queryFn: () => unitCity({ cityId }),
        staleTime: REQUEST_CACHE_TIME
    });
}