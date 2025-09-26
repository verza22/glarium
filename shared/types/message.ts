// shared/types/message.ts
export interface Message {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAtFrom?: Date;
    deletedAtTo?: Date;
    cityFromId: number;
    cityToId: number;
    type: number;
    readed: number;
    message: string;
  }