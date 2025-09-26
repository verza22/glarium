// shared/types/userResource.ts
export interface UserResource {
    id: number;
    userId: number;
    gold: number;           
    researchPoint: number;  
    tradeShip: number;
    tradeShipAvailable: number;
    createdAt: Date;
    updatedAt: Date;
  }