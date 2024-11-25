export interface IuserData{
    username:string,
    email:string,
    password:string,
    dob:string,
    gender:string,
    role_id:string
    status:string
    actionType?:string
}
export interface IuserEditData{
    username:string,
    email:string,
    dob:string,
    gender:string,
    role_id:string,
    actionType?:string
}
export interface IuserLoginData{
    email:string,
    password:string
}