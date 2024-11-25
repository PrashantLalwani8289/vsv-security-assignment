export interface RolegetApi{
    _id: string;
    name: string;
}
export interface postUserData{
    username: string;
    email: string;
    dob: Date;
    gender: string;
    role_id: string;
}
export interface GetUserData{
    _id: string;
    username: string;
    email: string;
    dob: string;
    gender: string;
    role: string;
    status: string;
}