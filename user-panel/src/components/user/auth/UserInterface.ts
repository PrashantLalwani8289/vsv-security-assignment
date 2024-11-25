export interface UserRegister{
    username: string;
    password: string;
    email: string;
    dob: Date;
    gender:string;
}
export interface UserLogin{
    email:string;
    password:string;
}