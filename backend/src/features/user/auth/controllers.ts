import UserPanelService from "./service"
import {Request,Response} from "express";
export const UserRegister = async (req:Request, res:Response) => {
    try {
        const result = await UserPanelService.userRegister(req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const userLogin = async (req:Request, res:Response) => {
    try {
        const result = await UserPanelService.userLogin(req.body)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
}
export const GetProfile = async (req:Request, res:Response) => {
    try {
        const result = await UserPanelService.GetProfile(req.params.id)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
}
export const UpdateProfile = async (req:Request, res:Response) => {
    try {
        const result = await UserPanelService.UpdateProfile(req.params.id,req.body)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
}