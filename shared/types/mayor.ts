// shared/types/mayor.ts
export interface Mayor {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    cityId: number;
    type: number;
    readed: number;
    data: any; // Prisma Json
  }