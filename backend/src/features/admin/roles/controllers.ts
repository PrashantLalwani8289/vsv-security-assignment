import { Request,Response } from "express";
import RoleService from "./service"

export const CreateRole = async (req: Request, res:Response) => {
    try {
        const result = await RoleService.CreateRole(req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const GetAllRoles = async (req: Request, res:Response) => {
    try {
        const result = await RoleService.GetAllRoles()
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const GetAllRolesWithId = async (req: Request, res:Response) => {
    try {
        const result = await RoleService.GetAllRolesWithId()
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const GetRoleById = async (req: Request, res:Response) => {
    try {
        const result = await RoleService.GetRoleById(req.params.roleId)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const UpdateRole = async (req: Request, res:Response) => {
    try {
        const result = await RoleService.UpdateRole(req.params.roleId,req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};