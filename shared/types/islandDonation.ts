// shared/types/islandDonation.ts
export interface IslandDonation {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    islandId: number;
    cityId: number;
    type: number;
    donated: number;
  }