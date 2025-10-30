import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ResponseCityGetInfo } from "@shared/types/responses";
import { Resources } from "@shared/types/models";

interface UpdateUserResource {
    newGold: number;
    newTradeShip: number;
    newTradeAvailableShip: number;
}

interface CityState extends ResponseCityGetInfo {
    setCity: (data: Partial<CityState>) => void,
    updateResources: (resources: Resources) => void,
    setTradeShip: (data: UpdateUserResource) => void,
    setTradeAvailableShip: (tradeShipAvailable: number) => void,
    setWine: (wine: number) => void,
    setScientist: (scientist: number, populationAvailable: number) => void,
    setPopulation: (population: number, populationAvailable: number) => void,
    setWorkerForest: (workerForest: number, populationAvailable: number) => void,
    setWorkerMine: (workerMine: number, populationAvailable: number) => void
};

export const useCityStore = create<CityState>()(
    persist(
        (set) => ({
            cities: [],
            population: {
                population: 0,
                populationAvailable: 0,
                workerForest: 0,
                workerMine: 0,
                scientists: 0,
                wine: 0
            },
            actionPoints: { pointMax: 0, point: 0 },
            resources: {
                wood: 0,
                marble: 0,
                wine: 0,
                glass: 0,
                sulfur: 0
            },
            userResources: {
                gold: 0,
                tradeShip: 0,
                tradeShipAvailable: 0
            },

            setCity: (data) => set((state) => ({ ...state, ...data })),
            updateResources: (resources: Resources) => set((state) => ({ ...state, resources })),
            setWorkerForest: (workerForest: number, populationAvailable: number) => set((state) => ({ ...state, population: { ...state.population, workerForest, populationAvailable } })),
            setWorkerMine: (workerMine: number, populationAvailable: number) => set((state) => ({ ...state, population: { ...state.population, workerMine, populationAvailable } })),
            setWine: (wine: number) => set((state) => ({ ...state, population: { ...state.population, wine } })),
            setScientist: (scientists: number, populationAvailable: number) => set((state) => ({ ...state, population: { ...state.population, scientists, populationAvailable } })),
            setPopulation: (population: number, populationAvailable: number) => set((state) => ({ ...state, population: { ...state.population, population, populationAvailable } })),
            setTradeAvailableShip: (tradeShipAvailable: number) => set((state) => ({ ...state, userResources: { ...state.userResources, tradeShipAvailable } })),
            setTradeShip: (data: UpdateUserResource) => set((state) => ({
                ...state,
                userResources: {
                    gold: data.newGold,
                    tradeShip: data.newTradeShip,
                    tradeShipAvailable: data.newTradeAvailableShip
                }
            })),
        }),
        {
            name: "city-storage"
        }
    )
);