// shared/types/regimentTail.ts
export interface RegimentTail {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    constructedAt?: Date;
    regimentId: number;
    unitId: number;
    cant: number;
    tail: number;
  }