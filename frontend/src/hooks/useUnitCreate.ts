import { useMutation } from "@tanstack/react-query";
import { unitCreate } from "../services/unitService";
import { useCityStore } from "../store/cityStore";
import { useUserStore } from "../store/userStore";
import { ResponseUnitCreate } from "@shared/types/responses";

export function useUnitCreate() {
    const { updateResources, setPopulation } = useCityStore();
    const cityId = useUserStore(state => state.cityId);

    return useMutation({
        mutationFn: ({ units, cants }: { units: number[], cants: number[] }) => unitCreate({ cityId, units, cants }),
        onSuccess: (response: ResponseUnitCreate) => {
            updateResources(response.resources);
            setPopulation(response.population.population, response.population.populationAvailable);
        }
    });
}