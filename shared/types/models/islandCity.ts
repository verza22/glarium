// shared/types/islandCity.ts
export interface IslandCity {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    position: number;
    islandId: number;
    cityId: number;
  }