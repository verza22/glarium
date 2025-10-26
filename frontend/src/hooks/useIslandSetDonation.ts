import { useMutation } from "@tanstack/react-query";
import { setDonation } from "../services/islandService";
import { Resources } from "@shared/types/models";
import { useCityStore } from "../store/cityStore";
import { useUserStore } from "../store/userStore";

export function useIslandSetDonation() {
    const updateResources = useCityStore(state => state.updateResources);
    const cityId = useUserStore(state => state.cityId);

    return useMutation({
        mutationFn: ({ wood, islandId, type }: {wood: number, islandId: number, type: boolean}) => setDonation({ islandId, type, cityId, wood }),
        onSuccess: (response: Resources) => {
            updateResources(response);
        }
    });
}