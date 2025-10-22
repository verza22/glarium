import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCityGetInfo } from "../services/cityService";
import { ResponseCityGetInfo } from "@shared/types/responses";
import { useCityStore } from "../store/cityStore";

export function useCityGetInfoMutation() {
    const queryClient = useQueryClient();
    const setCity = useCityStore(state => state.setCity);

    return useMutation({
        mutationFn: async (cityId: number) => {
            const cached = queryClient.getQueryData<ResponseCityGetInfo>(["city", cityId]);
            if (cached) return cached;
            
            const response = await fetchCityGetInfo({ cityId });
            queryClient.setQueryData(["city", cityId], response);
            return response;
        },
        onSuccess: (response: ResponseCityGetInfo) => {
            setCity(response);
        },
    });
}