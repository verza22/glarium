// shared/types/island.ts
export interface Island {
    id: number;
    islandSectorId: number;
    x: number;
    y: number;
    name: string;
    type: number;
    forestId: number;
    mineId: number;
    donatedForest: number;
    donatedMine: number;
    forestConstructedAt?: Date;
    mineConstructedAt?: Date;
  }