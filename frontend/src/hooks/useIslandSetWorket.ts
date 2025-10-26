import { useMutation } from "@tanstack/react-query";
import { setWorker } from "../services/islandService";
import { useCityStore } from "../store/cityStore";
import { useUserStore } from "../store/userStore";

export function useIslandSetWorker() {
    const { setWorkerForest, setWorkerMine } = useCityStore();
    const cityId = useUserStore(state=> state.cityId);

    return useMutation({
        mutationFn: ({workers, type}: { workers: number, type: boolean }) => setWorker({ cityId, workers, type }),
        onSuccess: (response, variables) => {
            if (variables.type) {
                setWorkerForest(variables.workers, response.populationAvailable);
            } else {
                setWorkerMine(variables.workers, response.populationAvailable);
            }
        }
    });
}