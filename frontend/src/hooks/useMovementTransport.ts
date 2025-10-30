import { useMutation } from "@tanstack/react-query";
import { transport } from "../services/movementService";
import { useCityStore } from "../store/cityStore";
import { useUserStore } from "../store/userStore";
import { ResponseMovementTransport } from "@shared/types/responses";

export function useMovementTransport() {
    const { updateResources, setTradeShip } = useCityStore();
    const cityId = useUserStore(state => state.cityId);

    return useMutation({
        mutationFn: ({ cityToId, wood, wine, marble, glass, sulfur }:
            { cityToId: number, wood: number, wine: number, marble: number, glass: number, sulfur: number }
        ) => transport({ cityId, cityToId, wood, wine, marble, glass, sulfur }),
        onSuccess: (response: ResponseMovementTransport) => {
            updateResources(response.resources);
            setTradeShip(response.userResources);
        }
    });
}