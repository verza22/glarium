import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ResponseCityGetInfo } from "@shared/types/responses";
import { Resources } from "@shared/types/models";

interface CityState extends ResponseCityGetInfo {
    setCity: (data: Partial<CityState>) => void,
    updateResources: (resources: Resources) => void
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
                scientists: 0
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
            updateResources:  (resources: Resources) => set((state) => ({ ...state, resources })),
        }),
        {
            name: "city-storage"
        }
    )
);