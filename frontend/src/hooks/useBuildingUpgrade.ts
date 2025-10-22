import { useMutation, useQueryClient } from "@tanstack/react-query";
import { buildingUpgrade } from "../services/buildingService";
import { RequestBuildingUpgrade } from "@shared/types/requests";
import { Resources } from "@shared/types/models";
import { useCityStore } from "../store/cityStore";
import { useUserStore } from "../store/userStore";

export function useBuildingUpgrade() {
    const queryClient = useQueryClient();
    const updateResources = useCityStore(state => state.updateResources);
    const cityId = useUserStore(state => state.cityId);

    return useMutation({
        mutationFn: ({ cityBuildingId }: RequestBuildingUpgrade) => buildingUpgrade({ cityBuildingId }),
        onSuccess: (response: Resources) => {
            updateResources(response);
            queryClient.invalidateQueries({ queryKey: ["buildingGetInfo", cityId] });
        }
    });
}