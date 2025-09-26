// shared/types/regiment.ts
export interface Regiment {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    userId: number;
    cityId: number;
    travel: number;
  }