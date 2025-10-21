import { useMutation, useQueryClient } from "@tanstack/react-query";
import { buildingCreate } from "../services/buildingService";
import { useCityStore } from "../store/cityStore";
import { Resources } from "@shared/types/models";
import { useUserStore } from "../store/userStore";

export function useBuildingCreate() {
    const queryClient = useQueryClient();
    const updateResources = useCityStore(state => state.updateResources);
    const cityId = useUserStore(state => state.cityId);

    return useMutation({
        mutationFn: ({ position, buildingId }: { position: number, buildingId: number }) => buildingCreate({ cityId, position, buildingId }),
        onSuccess: (response: Resources) => {
            updateResources(response);
            queryClient.invalidateQueries({ queryKey: ["buildingGetInfo", cityId] });
        }
    });
}