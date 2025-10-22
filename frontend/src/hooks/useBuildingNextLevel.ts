import { useMutation } from "@tanstack/react-query";
import { buildingNextLevel } from "../services/buildingService";
import { RequestBuildingNextLevel } from "@shared/types/requests";
import { useUserStore } from "../store/userStore";

export function useBuildingNextLevel() {
    const cityId = useUserStore(state=> state.cityId);
    return useMutation({
        mutationFn: ({ position, buildingId }: {position:number, buildingId:number}) => buildingNextLevel({ position, buildingId, cityId }),
    });
}