// shared/types/city.ts
export interface City {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    constructedAt?: Date;
    name: string;
    wood: number;
    wine: number;
    marble: number;
    glass: number;
    sulfur: number;
    apoint: number;
  }