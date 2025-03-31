export interface AuthAttributes {
    id: string;
    userId: string;
    token: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }