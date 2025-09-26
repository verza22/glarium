// shared/types/passwordReset.ts
export interface PasswordReset {
    id: number;
    email: string;
    token: string;
    createdAt?: Date;
  }