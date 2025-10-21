export interface ResponseBuildingGetInfo {
    id: number;
    cityId: number;
    position: number;
    buildingId: number;
    level: number;
    constructedAt: Date|null;
}

export interface ResponseBuildingAvailable {
    id: number;
    wood: number;
    wine: number;
    marble: number;
    glass: number;
    sulfur: number;
    time: number;
    research: boolean;
    researchId: number;
}