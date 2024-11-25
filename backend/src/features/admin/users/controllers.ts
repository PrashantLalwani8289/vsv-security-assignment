import {Request,Response} from "express";
import UserService from "./service"
import { CustomRequest } from "../../../middleware/authMiddleware";

export const UserCreate = async (req:Request, res:Response) => {
    try {
        const result = await UserService.UserCreate(req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const UserLogin = async (req:Request, res:Response) => {
    try {
        const result = await UserService.UserLogin(req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const UserUpdate = async (req:Request, res:Response) => {
    try {
        const result = await UserService.UserUpdate(req.params.id,req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const UserProfile = async (req:CustomRequest, res:Response) => {
    try {
        const id=req.UserId
        const result = await UserService.UserProfile(id as string)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const UserRead = async (req:CustomRequest, res:Response) => {
    try {
        const id=req.UserId
        const result = await UserService.UserRead(id as string)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const UserStatusUpdate = async (req:CustomRequest, res:Response) => {
    try {
        const result = await UserService.UserStatusUpdate(req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const UserEdit = async (req:CustomRequest, res:Response) => {
    try {
        const result = await UserService.UserEdit(req.params.id)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
// CUSTOMERS CONTROLLER

export const CustomerRead = async (req:Request, res:Response) => {
    try {
        const result = await UserService.CustomerRead()
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};

export const CustomerStatusUpdate = async (req:Request, res:Response) => {
    try {

        const result = await UserService.CustomerStatusUpdate(req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
