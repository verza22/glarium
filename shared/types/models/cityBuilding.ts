// shared/types/cityBuilding.ts
export interface CityBuilding {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    constructedAt?: Date;
    buildingLevelId: number;
    cityId: number;
    position: number;
}


export interface CityFlat {
    id: number;
    name: string;
    capital: boolean;
    island_id: number;
    x: number;
    y: number;
    type: number;
}