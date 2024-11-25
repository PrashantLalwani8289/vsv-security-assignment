import { ReactNode } from "react";

export interface FirstState{
    isAuthenticated: boolean;
    user:userData|null;
}
export interface userData{
    id:string
    username:string;
    email:string;
    token:string
}
export interface permissionData{
    id:string;
    name:string;
}
export interface role{
    id:string;
    name:string;
}
export interface ProtectedRoutesProps {
    isAuthenticated: boolean;
    children?:ReactNode
}
export interface TokenPayload {
    exp: number;
}