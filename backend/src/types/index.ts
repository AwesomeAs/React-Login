export interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    active: boolean;
    roles: string[];
}
