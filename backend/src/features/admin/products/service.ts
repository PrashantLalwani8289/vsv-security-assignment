import mongoose from "mongoose";
import { OrdersModel } from "../../user/products/modal/OrderModel";
import { IProductsAdd, IUpdateStatus, ProductData } from "./interfaces";
import { ProductModal } from "./model";
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
class ProductService {
    async CreateProduct(data: IProductsAdd) {
        try {
            const { name, price, quantity, category_id, description, image } = data;
            const product = new ProductModal({ name, price, quantity, category_id, description, image });
            const result = await product.save();
            if (result) {
                response.success = true;
                response.message = "Product created successfully";
                response.data = '';
            } else {
                response.message = "Failed to create product";
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
    async ReadProduct() {
        try {
            const result = await ProductModal.aggregate([
                {
                    $lookup: {
                        from: "products_catgeories",
                        localField: "category_id",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        price: 1,
                        quantity: 1,
                        description: 1,
                        image: 1,
                        status: 1,
                        category: { $first: "$category.name" }
                    }
                },
                {
                    $sort: {
                        _id: -1
                    }
                }
            ]);
            if (result) {
                response.success = true;
                response.message = "Product fetched successfully";
                response.data = result;
            } else {
                response.success = false;
                response.message = "Product can not fetched";
                response.data = '';
            }
        } catch (error) {
            response.success = false;
            response.message = "An error occurred while fetching the product";
            response.data = '';
        }
        return response;
    }
    async EditProduct(id: string) {
        try {
            const product = await ProductModal.findById(id, {
                name: 1,
                price: 1,
                quantity: 1,
                category_id: 1,
                description: 1,
                image: 1
            });
            if (product) {
                response.success = true;
                response.message = "Product updated successfully";
                response.data = product;
            } else {
                response.success = false;
                response.message = "Product can not updated";
                response.data = '';
            }
        } catch (error) {
            response.success = false;
            response.message = "An error occurred while updating the product";
            response.data = '';
        }
        return response;
    }
    async UpdateProduct(id: string, data: IProductsAdd) {
        try {
            const result = await ProductModal.findByIdAndUpdate(id, data, { new: true });
            if (result) {
                response.success = true;
                response.message = "Product updated successfully";
                response.data = '';
            } else {
                response.success = false;
                response.message = "Product can not updated";
                response.data = '';
            }
        } catch (error) {
            response.success = false;
            response.message = "An error occurred while updating the product";
            response.data = '';
        }
        return response;
    }
    async UpdateProductStatus(id: string) {
        const product_id = new mongoose.Types.ObjectId(id);
        const product = await ProductModal.findById(product_id);
        if (product) {
            const newStatus = product.status === 'active' ? 'inactive' : 'active';
            const updatedProducts = await ProductModal.findByIdAndUpdate(
                product_id,
                { status: newStatus }
            );
            response.success = true;
            response.message = "Products status updated successfully";
            response.data = null;
        } else {
            response.message = "Product not found";
            response.success = false;
        }
        return response;
    }
    async ReadOrder() {
        try {
            const orders = await OrdersModel.aggregate([
                { $unwind: '$cart_id' },
                {
                    $addFields: {
                        cart_id: { $toObjectId: '$cart_id' }
                    }
                },
                {
                    $lookup: {
                        from: 'carts',
                        localField: 'cart_id',
                        foreignField: '_id',
                        as: 'cart_items'
                    }
                },
                { $unwind: '$cart_items' },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'cart_items.product_id',
                        foreignField: '_id',
                        as: 'product_details'
                    }
                },
                { $unwind: '$product_details' },
                {
                    $lookup: {
                        from: 'addresses',
                        localField: 'address_id',
                        foreignField: '_id',
                        as: 'address_details'
                    }
                },
                { $unwind: '$address_details' },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'users_details'
                    }
                },
                { $unwind: '$users_details' },
                {
                    $group: {
                        _id: '$_id',
                        total_price: { $first: '$total_price' },
                        status: { $first: '$status' },
                        createdAt: { $first: '$createdAt' },
                        address: { $first: '$address_details' },
                        users: { $first: '$users_details' },
                        products: {
                            $addToSet: {
                                name: '$product_details.name',
                                price: '$product_details.price',
                                total_price: '$cart_items.total_price',
                                quantity: '$cart_items.quantity'
                            }
                        }
                    }
                },
                {
                    $project: {
                        total_price: 1,
                        status: 1,
                        createdAt: 1,
                        address: {
                            pin: '$address.pin',
                            house_no: '$address.house_no',
                            city: '$address.city',
                            state: '$address.state'
                        },
                        user_name: '$users.username',
                        products: 1
                    }
                }, {
                    $sort: {
                        _id: -1
                    }
                }
            ]);
            if (orders) {
                response.success = true;
                response.message = "Orders fetched successfully";
                response.data = orders;
            } else {
                response.success = false;
                response.message = "Orders can not fetched";
                response.data = '';
            }

        } catch (error) {
            response.success = false;
            response.message = "An error occurred while fetching the orders";
            response.data = '';
        }
        return response;
    }
    async UpdateOrder(id: string, status: IUpdateStatus) {
        try {
            const order = await OrdersModel.findByIdAndUpdate(id, status, { new: true });
            if (order) {
                response.success = true;
                response.message = "Order updated successfully";
                response.data = {};
            } else {
                response.success = false;
                response.message = "Order can not updated";
                response.data = '';
            }
        } catch (error) {
            response.success = false;
            response.message = "An error occurred while updating the order";
            response.data = '';
        }
        return response;
    }
    async ExportProducts(req: Request, res: Response) {
        const workbook = new Workbook()
        const worksheet = workbook.addWorksheet('Products')
        worksheet.columns = [
            { header: 'S No.', key: 's_no', width: 15 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Price', key: 'price', width: 15 },
            { header: 'Quantity', key: 'quantity', width: 15 },
            { header: 'Category', key: 'category', width: 30 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Created At', key: 'createdAt', width: 30 },
        ]
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFE0B2' }, // Light orange color
            };
        });
        const products = await ProductModal.aggregate([
            {
                $lookup: {
                    from: "products_catgeories",
                    localField: "category_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    price: 1,
                    quantity: 1,
                    description: 1,
                    status: 1,
                    category: { $first: "$category.name" },
                    createdAt: 1
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]);
        let count = 1;
        products.forEach((product) => {
            product.s_no = count++;
            worksheet.addRow(product)
        })
        const filePath = path.join(__dirname, 'products.xlsx');
        await workbook.xlsx.writeFile(filePath);
        res.download(filePath, 'products.xlsx', (err: any) => {
            if (err) {
                console.error(err);
                response.success = false;
                response.message = "Failed to export products";
            } else {
                response.success = true;
                response.message = "Products exported successfully";
            }
            fs.unlinkSync(filePath); // Remove the file after sending it
        });

    }
    async ExportSampleExcel(req: Request, res: Response) {
        const workbook = new Workbook()
        const worksheet = workbook.addWorksheet('Sample')
        const categories = await ProductCategoryModal.find({}, { _id: 0, name: 1 })
        const Categories_name: string[] = [];
        categories.forEach((category) => {
            Categories_name.push(category.name);
        })
        const categoriesString = Categories_name.join(',');
        const formattedString = [`"${categoriesString}"`];
        console.log(formattedString)
        for (let i = 2; i <= 50; i++) {
            worksheet.getCell(`D${i}`).dataValidation = {
                type: 'list',
                allowBlank: true,
                formulae: formattedString, // Adjust the range based on category count
            };

            worksheet.getCell(`B${i}`).dataValidation = {
                type: 'whole',
                operator: 'greaterThan',
                showErrorMessage: true,
                formulae: [0],
                errorStyle: 'error',
                errorTitle: 'Positive',
                error: 'The value must be positive',
            };
        }
        worksheet.columns = [
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Price', key: 'price', width: 15 },
            { header: `Quantity`, key: 'quantity', width: 15 },
            { header: `Category[${Categories_name}]`, key: 'category', width: 70 },
            { header: 'Description', key: 'description', width: 50 },
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
        // worksheet.getColumn('price').eachCell((cell, rowNumber) => {
        //     if (rowNumber > 1) { // Skip the header rows
        //         cell.dataValidation = {
        //             type: 'decimal',
        //             operator: 'greaterThan',
        //             formulae: ['0'],
        //             showErrorMessage: true,
        //             errorTitle: 'Invalid input',
        //             error: 'Price must be a number greater than 0'
        //         };
        //     }
        // });
        const filePath = path.join(__dirname, 'products.xlsx');
        await workbook.xlsx.writeFile(filePath);
        res.download(filePath, 'products.xlsx', (err: any) => {
            if (err) {
                console.error(err);
                response.success = false;
                response.message = "Failed to export products";
            } else {
                response.success = true;
                response.message = "Products exported successfully";
            }
            fs.unlinkSync(filePath);
        });
    }

    async ImportExcel(data: ProductData[]) {
        const problematicRows: number[] = [];
        try {
            const categories = await ProductCategoryModal.find({});
            const categoryMap: { [key: string]: string } = {};
            categories.forEach((category) => {
                categoryMap[category.name] = category._id.toString();
            });

            const validateNumber = (value: string | number, fieldName: string, rowIndex: number) => {
                if (isNaN(Number(value))) {
                    problematicRows.push(rowIndex);
                    return null;
                }
                return Number(value);
            };
            const products = [];
            for (let i = 0; i < data.length; i++) {
                const row = data[i];
                const { name, price, quantity, category, description } = row;
                const validatedPrice = validateNumber(price, 'Price', i + 1);
                const validatedQuantity = validateNumber(quantity, 'Quantity', i + 1);
                if (validatedPrice === null || validatedQuantity === null) {
                    continue;
                }

                let category_id = categoryMap[category];
                if (!category_id) {
                    const newCategory = await ProductCategoryModal.create({ name: category });
                    category_id = newCategory._id.toString();
                    categoryMap[category] = category_id;
                }

                products.push({
                    name,
                    price: validatedPrice,
                    quantity: validatedQuantity,
                    image: "",
                    category_id,
                    description,
                    createdAt: new Date()
                });
            }

            if (products.length > 0) {
                await ProductModal.insertMany(products);
            }

            if (problematicRows.length > 0) {
                response.success = false;
                response.message = "There were problems with some rows." + problematicRows + "others rows were successfully created.";;
            } else {
                response.success = true;
                response.message = "Products imported successfully.";
            }
        } catch (error) {
            console.error(error);
            response.success = false;
            response.message = `An error occurred while importing the products: ${error}`;
        }

        return response;
    }
}
export default new ProductService