// shared/types/regimentUnit.ts
export interface RegimentUnit {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    regimentId: number;
    unitId: number;
    cant: number;
  }