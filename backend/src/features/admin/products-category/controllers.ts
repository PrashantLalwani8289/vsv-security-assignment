import { Request,Response } from "express";
import ProductCategoryService from "./service"

export const CreateCategory = async (req: Request, res:Response) => {
    try {
        const result = await ProductCategoryService.CreateCategory(req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const UpdateCategory = async (req: Request, res:Response) => {
    try {
        const result = await ProductCategoryService.UpdateCategory(req.params.id,req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const ReadCategory = async (req: Request, res:Response) => {
    try {
        const result = await ProductCategoryService.ReadCategory()
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};