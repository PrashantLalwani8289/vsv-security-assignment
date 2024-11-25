export interface Permission {
    _id: string;
    name: string;
}

export interface User {
    _id: string;
    email: string;
    username: string;
}

export interface Role {
    _id: string;
    name: string;
    permissions: Permission[];
    users: User[];
}