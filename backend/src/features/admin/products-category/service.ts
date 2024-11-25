import mongoose from "mongoose";
import { ICategoryAdd } from "./interfaces";
import { ProductCategoryModal } from "./model";

const response: {
    message: string;
    data?: unknown;
    success: boolean;
} = { message: "", success: false };
class ProductCategoryService {
    async CreateCategory(data:ICategoryAdd){
        try {
            const { name } = data;
            const category = new ProductCategoryModal({ name });
            const result = await category.save();
            if (result) {
                response.success = true;
                response.message = "Category created successfully";
                response.data = '';
            }
        } catch (error) {
            response.message = "Failed to create category";
            response.success = false;
            response.data = '';
        }
        return response;
    }
    async UpdateCategory(id:string, data:ICategoryAdd){
        try {
            const {name}=data;
            const categoryId = new mongoose.Types.ObjectId(id);
            const category = await ProductCategoryModal.findByIdAndUpdate(categoryId, { name }, { new: true });
            if (category) {
                response.success = true;
                response.message = "Category updated successfully";
                response.data = '';
            } else {
                response.message = "Category not found";
                response.success = false;
                response.data = '';
            }
        } catch (error) {
            response.message = "Failed to update category";
            response.success = false;
            response.data = '';
        }
        return response;
    }
    async ReadCategory(){
        try {
            const categories = await ProductCategoryModal.find({},{name:1,_id:1});
            response.message = "Categories fetched successfully";
            response.data = categories;
            response.success = true;
        } catch (error) {
            response.message = "Failed to fetch categories";
            response.success = false;
            response.data = [];
        }
        return response;
    }
}
export default new ProductCategoryService