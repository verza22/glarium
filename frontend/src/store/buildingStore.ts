import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ResponseBuildingGetInfo } from "@shared/types/responses";

interface BuildingState {
    buildings: ResponseBuildingGetInfo[],
    setBuildings: (data: Partial<BuildingState>) => void
};

export const useBuildingStore = create<BuildingState>()(
    persist(
        (set) => ({
            buildings: [],

            setBuildings: (data) => set((state) => ({ ...state, ...data })),
        }),
        {
            name: "buildings-storage"
        }
    )
);