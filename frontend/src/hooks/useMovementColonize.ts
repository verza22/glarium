import { useMutation } from "@tanstack/react-query";
import { colonize } from "../services/movementService";
import { useCityStore } from "../store/cityStore";
import { useUserStore } from "../store/userStore";
import { ResponseMovementColonize } from "@shared/types/responses";

export function useMovementColonize() {
    const { updateResources, setTradeShip } = useCityStore();
    const cityId = useUserStore(state => state.cityId);

    return useMutation({
        mutationFn: ({ islandId, position }: { islandId: number, position: number }) => colonize({ cityId, islandId, position }),
        onSuccess: (response: ResponseMovementColonize) => {
            updateResources(response.resources);
            setTradeShip(response.userResources);
        }
    });
}