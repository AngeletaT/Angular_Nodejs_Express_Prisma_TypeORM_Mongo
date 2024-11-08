export interface IUser {
    email: string;
    username: string;
    password: string;
    image?: string;
    roles: string[];
    busy?: boolean;
    jobs?: string[];
}