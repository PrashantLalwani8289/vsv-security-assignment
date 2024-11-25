import { Request,Response } from "express";
import ProductService from "./service"
import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
export const CreateProduct = async (req: Request, res:Response) => {
    try {
        const result = await ProductService.CreateProduct(req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const ReadProduct = async (req: Request, res:Response) => {
    try { 
        const result = await ProductService.ReadProduct()
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const EditProduct = async (req: Request, res:Response) => {
    try {
        const result = await ProductService.EditProduct(req.params.id)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const UpdateProduct = async (req: Request, res:Response) => {
    try {
        const result = await ProductService.UpdateProduct(req.params.id,req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const ReadOrder = async (req: Request, res:Response) => {
    try {
        const result = await ProductService.ReadOrder()
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const UpdateOrder = async (req: Request, res:Response) => {
    try {
        const result = await ProductService.UpdateOrder(req.params.id,req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const UpdateProductStatus = async (req: Request, res:Response) => {
    try {
        const result = await ProductService.UpdateProductStatus(req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};

export const ExportProducts = async (req: Request, res:Response) => {
    try {
        await ProductService.ExportProducts(req,res)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const ExportSampleExcel = async (req: Request, res:Response) => {
    try {
        await ProductService.ExportSampleExcel(req,res)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const ImportExcel = async (req: Request, res:Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }
        const file = req.file;

        const workbook = new ExcelJS.Workbook();
        try {
            await workbook.xlsx.load(file.buffer); // Use buffer instead of reading from disk
            const worksheet = workbook.getWorksheet(1);
            if(!worksheet){
                return res.status(400).json({ success: false, message: "No worksheet found in the Excel file" });
            }
            const data: any[] = [];
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) { // Skip header row
                    const rowData = {
                        name: row.getCell(1).value,
                        price: row.getCell(2).value,
                        quantity: row.getCell(3).value,
                        category: row.getCell(4).value,
                        description: row.getCell(5).value,
                    };
                    data.push(rowData);
                }
            });

            const result = await ProductService.ImportExcel(data);
            return res.status(201).json(result);

        } catch (error) {
            console.error("Error loading Excel file:", error);
            return res.status(400).json({ success: false, message: "Invalid Excel file format or corrupted file" });
        }
    } catch (error) {
        res.status(400).json(error)
    }
};