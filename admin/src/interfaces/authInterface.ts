import { ReactNode } from "react";

export interface FirstState{
    isAuthenticated: boolean;
    user:userData|null;
    token:string;
    permission:permissionData[]|[];
    user_role:role|null;
}
export interface userData{
    id:string
    username:string;
    email:string;
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
    requiredPermissions: string;
    children?:ReactNode
}
export interface TokenPayload {
    exp: number;
}