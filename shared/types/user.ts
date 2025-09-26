// shared/types/user.ts
export interface User {
    id: number;
    name: string;
    email: string;
    emailVerifiedAt?: Date;
    password: string;
    rememberToken?: string;
    createdAt: Date;
    updatedAt: Date;
  }