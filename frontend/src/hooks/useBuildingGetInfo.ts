import { useQuery } from "@tanstack/react-query";
import { fetchBuildingGetInfo } from "../services/buildingService";
import { REQUEST_CACHE_TIME } from "../config";
import { useEffect } from "react";
import { useBuildingStore } from "../store/buildingStore";

export function useBuildingGetInfo(cityId: number) {
    const setBuildings = useBuildingStore((state) => state.setBuildings);

    const query = useQuery({
        queryKey: ["buildingGetInfo", cityId],
        queryFn: () => fetchBuildingGetInfo({ cityId }),
        enabled: !!cityId,
        staleTime: REQUEST_CACHE_TIME
    });

    useEffect(() => {
        if (query.data) {
            setBuildings({ buildings: query.data });
        }
    }, [query.data, setBuildings]);

    return query;
}