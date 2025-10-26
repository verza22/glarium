import { useCityStore } from "../store/cityStore";

export const usePopulationAvailable = () => {
    const population = useCityStore(state => state.population);

    return population.population - (population.workerForest + population.workerMine + population.scientists);
}