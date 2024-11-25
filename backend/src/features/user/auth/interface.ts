export interface IUserRegister {
    username: string;
    email: string;
    password: string;
    dob: string;
    gender: string;
}

export interface IUserLogin {
    email: string;
    password: string;
}

export interface IProfileData {
    username: string;
    email: string;
    dob: string;
    gender: string;
}
export interface QueryParams {
    page: number;
    limit: number;
    search?:string;
    sort?: string;
    category?: string;
    filter?: string;
}
export interface IGoogleCredential {
    token: string;
}