import { useMutation } from "@tanstack/react-query";
import { fetchCityGetInfo } from "../services/cityService";
import { ResponseCityGetInfo } from "@shared/types/responses";
import { useCityStore } from "../store/cityStore";

export function useCityGetInfoMutation() {
    const setCity = useCityStore(state => state.setCity);

    return useMutation({
        mutationFn: (cityId: number) => fetchCityGetInfo({ cityId }),
        onSuccess: (response: ResponseCityGetInfo) => {
            setCity(response);
        }
    });
}