import { useMutation } from "@tanstack/react-query";
import { buyTradeShip } from "../services/userService";
import { useCityStore } from "../store/cityStore";

export const useBuyTradeShip = () => {
    const setTradeShip = useCityStore(state=> state.setTradeShip);
    return useMutation({
        mutationFn: buyTradeShip,
        onSuccess: (response) => {
            setTradeShip(response);
        }
    });
};