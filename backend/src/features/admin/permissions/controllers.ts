import { Request,Response } from "express";
import PermissionService from "./service"

export const CreatePermission = async (req: Request, res:Response) => {
    try {
        const result = await PermissionService.CreatePermission(req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const GetPermission = async (req: Request, res:Response) => {
    try {
        const result = await PermissionService.GetPermission()
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};