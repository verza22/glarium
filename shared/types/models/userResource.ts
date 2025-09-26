// shared/types/userResource.ts
export interface UserResource {
    id: number;
    userId: number;
    gold: string;            // Decimal(20,4) represeted like string
    researchPoint: string;   // Decimal(20,4) represeted like string
    tradeShip: number;
    tradeShipAvailable: number;
    createdAt: Date;
    updatedAt: Date;
  }