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