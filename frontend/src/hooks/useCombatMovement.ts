import { useMutation } from "@tanstack/react-query";
import { combatMovement } from "../services/combatService";
import { useUserStore } from "../store/userStore";
import { useCityStore } from "../store/cityStore";

export function useCombatMovement() {
    const cityFromId = useUserStore(state => state.cityId);
    const { setTradeAvailableShip, userResources } = useCityStore();

    return useMutation({
        mutationFn: ({ units, cants, tradeShip, cityId }:
            {
                units: number[],
                cants: number[],
                tradeShip: number,
                cityId: number
            }) => combatMovement({ cityFromId, units, cants, tradeShip, cityId }),
        onSuccess: (response, variables) => {
            setTradeAvailableShip(userResources.tradeShipAvailable - variables.tradeShip);
        }
    });
}