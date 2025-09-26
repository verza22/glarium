// shared/types/movement.ts
export interface Movement {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    startAt?: Date;
    endAt?: Date;
    returnAt?: Date;
    delivered: boolean;
    cancelled: boolean;
    userId: number;
    cityFromId: number;
    cityToId: number;
    movementTypeId: number;
    tradeShip: number;
  }