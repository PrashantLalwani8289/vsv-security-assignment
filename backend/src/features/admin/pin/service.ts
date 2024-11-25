import mongoose from "mongoose";
import { OrdersModel } from "../../user/products/modal/OrderModel";
import { IPinAdd, IUpdateStatus, ProductData } from "./interfaces";
import { PinModal } from "./model";
import { Workbook } from 'exceljs'
import fs from 'fs';
import path from "path";
import { Request, Response } from 'express';
import { ProductCategoryModal } from "../products-category/model";
const response: {
    message: string;
    data?: unknown;
    success: boolean;
} = { message: "", success: false };
class PinService {
    async CreatePin(data: IPinAdd) {
        try {
            const { pin, price } = data;
            const checkPin=await PinModal.find({ pin});
            if(checkPin.length > 0) {
                response.message = "Pin already exists";
                response.success = false;
                response.data = {};
                return response;
            }
            const product = new PinModal({ pin, price });
            const result = await product.save();
            if (result) {
                response.success = true;
                response.message = "pin created successfully";
                response.data = '';
            } else {
                response.message = "Failed to create pin";
                response.success = false;
                response.data = {};
            }
        } catch (error) {
            response.message = "Failed to create product";
            response.success = false;
            response.data = {};
        }
        return response;
    }
    async ReadPin() {
        try {
            const result = await PinModal.find({},{pin:1,_id:1,price:1}).sort({_id:1})
            if (result) {
                response.success = true;
                response.message = "Pin added successfully";
                response.data = result;
            } else {
                response.success = false;
                response.message = "Pin can not added";
                response.data = '';
            }
        } catch (error) {
            response.success = false;
            response.message = "An error occurred while fetching the Pin";
            response.data = '';
        }
        return response;
    }
    async UpdatePin(id: string, data: IPinAdd) {
        try {
            const {pin}=data
            const checkPin=await PinModal.find({ pin});
            if(checkPin.length > 0) {
                response.message = "Pin already exists";
                response.success = false;
                response.data = {};
                return response;
            }
            const result = await PinModal.findByIdAndUpdate(id, data, { new: true });
            if (result) {
                response.success = true;
                response.message = "Pin updated successfully";
                response.data = '';
            } else {
                response.success = false;
                response.message = "Pin can not updated";
                response.data = '';
            }
        } catch (error) {
            response.success = false;
            response.message = "An error occurred while updating the Pin";
            response.data = '';
        }
        return response;
    }
    async ExportSampleExcel(req: Request, res: Response) {
        const workbook = new Workbook()
        const worksheet = workbook.addWorksheet('Sample')
        worksheet.columns = [
            { header: 'Pin', key: 'pin', width: 30 },
            { header: 'Price', key: 'price', width: 15 },
        ]

        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'dashDot' },
            },
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFB0C4DE' },
                };
        })
        const filePath = path.join(__dirname, 'pins.xlsx');
        await workbook.xlsx.writeFile(filePath);
        res.download(filePath, 'pins.xlsx', (err: any) => {
            if (err) {
                console.error(err);
                response.success = false;
                response.message = "Failed to get pins";
            } else {
                response.success = true;
                response.message = "Pins exported successfully";
            }
            fs.unlinkSync(filePath);
        });
    }
    async ImportExcel(data: IPinAdd[]) {
        const problematicRows: number[] = [];
        const existingPins: Set<number> = new Set();
    
        const validateNumber = (value: string | number, fieldName: string, rowIndex: number) => {
            if (isNaN(Number(value))) {
                problematicRows.push(rowIndex);
                return null;
            }
            return Number(value);
        };
    
        try {
            // Check for existing pins first
            for (let i = 0; i < data.length; i++) {
                const row = data[i];
                const { pin } = row;
                const validatedPin = validateNumber(pin, 'pin', i + 1);
                if (validatedPin !== null) {
                    const pinExists = await PinModal.exists({ pin: validatedPin });
                    if (pinExists) {
                        problematicRows.push(i + 1);
                        existingPins.add(validatedPin);
                    }
                }
            }
    
            const pins = [];
            for (let i = 0; i < data.length; i++) {
                const row = data[i];
                const { pin, price } = row;
                const validatedPrice = validateNumber(price, 'Price', i + 1);
                const validatedPin = validateNumber(pin, 'pin', i + 1);
    
                if (validatedPrice === null || validatedPin === null || existingPins.has(validatedPin)) {
                    continue;
                }
    
                pins.push({
                    pin: validatedPin,
                    price: validatedPrice,
                });
            }
    
            if (pins.length > 0) {
                await PinModal.insertMany(pins);
            }
    
            const response: { success: boolean; message: string } = {
                success: false,
                message: '',
            };
    
            if (problematicRows.length > 0) {
                response.success = false;
                response.message = `There were problems with some rows: ${problematicRows.join(', ')}. Other rows were successfully created.`;
            } else {
                response.success = true;
                response.message = "Pins imported successfully.";
            }
    
            return response;
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: `An error occurred while importing the products: ${error}`,
            };
        }
    }
    
}
export default new PinService