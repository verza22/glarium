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