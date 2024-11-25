import { Request,Response } from "express";
import PinService from "./service"
import ExcelJS from 'exceljs';
export const CreatePin = async (req: Request, res:Response) => {
    try {
        const result = await PinService.CreatePin(req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const ReadPin = async (req: Request, res:Response) => {
    try { 
        const result = await PinService.ReadPin()
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const UpdatePin = async (req: Request, res:Response) => {
    try {
        const result = await PinService.UpdatePin(req.params.id,req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
};
export const ExportSampleExcel = async (req: Request, res:Response) => {
    try {
        await PinService.ExportSampleExcel(req,res)
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
            await workbook.xlsx.load(file.buffer); 
            const worksheet = workbook.getWorksheet(1);
            if(!worksheet){
                return res.status(400).json({ success: false, message: "No worksheet found in the Excel file" });
            }
            const data: any[] = [];
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) { 
                    const rowData = {
                        pin: row.getCell(1).value,
                        price: row.getCell(2).value,
                    };
                    data.push(rowData);
                }
            });

            const result = await PinService.ImportExcel(data);
            return res.status(201).json(result);

        } catch (error) {
            console.error("Error loading Excel file:", error);
            return res.status(400).json({ success: false, message: "Invalid Excel file format or corrupted file" });
        }
    } catch (error) {
        res.status(400).json(error)
    }
};