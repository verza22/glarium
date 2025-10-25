export interface ResponseBuildingGetInfo {
    id: number;
    cityId: number;
    position: number;
    buildingId: number;
    level: number;
    constructedAt: Date | null;
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

export interface ResponseBuildingNextLevel {
    maximum: boolean;
    level: number;
    buildingId: number;
    cityBuildingId: number;
    id: number;
    wood: number;
    wine: number;
    marble: number;
    glass: number;
    sulfur: number;
    time: number;
    units?: {
        id: number,
        population: number,
        wood: number,
        wine: number,
        glass: number,
        sulfur: number,
        time: number,
        barrackLevel: number,
        gold: number,
        trainer: number
    }[];
    tavern?: {
        wine: number,
        wineMax: number
    },
    academy?: {
        scientists: number,
        scientistsMax: number
    },
    barracks?: {
        tails: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            constructedAt: Date | null;
            regimentId: number;
            unitId: number;
            cant: number;
            tail: number;
        }[];
        units: {
            cant: number;
            unit_id: number;
            size: number;
        }[];
    }
}