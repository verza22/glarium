import { useMutation } from "@tanstack/react-query";
import { citySetWine } from "../services/cityService";
import { useCityStore } from "../store/cityStore";
import { useUserStore } from "../store/userStore";

export function useCitySetWine() {
    const setWine = useCityStore(state => state.setWine);
    const cityId = useUserStore(state => state.cityId);

    return useMutation({
        mutationFn: (wine: number) => citySetWine({ cityId, wine }),
        onSuccess: (response) => {
            setWine(response);
        }
    });
}