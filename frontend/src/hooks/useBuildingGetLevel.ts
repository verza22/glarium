import { useBuildingStore } from "../store/buildingStore";

export function useBuildingGetLevel(buildingId: number) {
    const buildings = useBuildingStore((state) => state.buildings);
    let level = 0;

    let i = buildings.findIndex(b=> b.buildingId === buildingId);
    if(i>=0)
        level = buildings[i].level;

    return level;
}