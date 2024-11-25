import mongoose from 'mongoose';
export interface IProductCategorySchema{
    name: string;
    createdAt:string;
}
const productCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdAT:{
        type: Date,
        default: Date.now()
    }
});

export const ProductCategoryModal = mongoose.model<IProductCategorySchema>('products_catgeory', productCategorySchema);
