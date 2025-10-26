export interface ResponseIslandGetInfo {
    id: number;
    x: number;
    y: number;
    name: string;
    type: number;
    levelForest: number;
    levelMine: number;
    cities: {
        cityId: number;
        position: number;
        level: number;
        constructedAt: Date;
        user: string;
        userId: number;
        name: string;
        type: boolean;
    }[];
}

export interface ResponseIslandGetData {
    donations: {
        id: number;
        cityId: number;
        donated: number;
        workers?: number;
    }[];
    maxWorkers: number;
    nextWood: number;
    constructedAt: string | null;
    donated: number;
}

export interface ResponseIslandSetWorker {
    populationAvailable: number
}