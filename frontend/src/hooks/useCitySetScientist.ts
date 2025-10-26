import { useMutation } from "@tanstack/react-query";
import { citySetScientists } from "../services/cityService";
import { useCityStore } from "../store/cityStore";
import { useUserStore } from "../store/userStore";

export function useCitySetScientists() {
    const setScientist = useCityStore(state => state.setScientist);
    const cityId = useUserStore(state => state.cityId);

    return useMutation({
        mutationFn: (scientists: number) => citySetScientists({ cityId, scientists }),
        onSuccess: (response, scientists) => {
            setScientist(scientists, response);
        }
    });
}