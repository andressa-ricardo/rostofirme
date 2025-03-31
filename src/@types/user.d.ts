import { Model } from 'sequelize';


export interface UserAttributes {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    password: string;
    avatar: string;
    pushToken: string | null;
    activated: boolean;
    role: 'administrator' | 'client';
}

export interface UserInstance extends Model<UserAttributes>, UserAttributes {
    isPasswordValid(password: string): Promise<boolean>;
}
