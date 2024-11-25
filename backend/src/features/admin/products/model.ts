import mongoose, { ObjectId, Schema } from 'mongoose';
export interface IProductSchema{
    name: string;
    price: number;
    category_id:ObjectId;
    quantity: number;
    description:string;
    image:string;
    review_id:ObjectId;
    admin_user_id:ObjectId;
    status:string;
    createdAt:string;
}
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    review_id: {
        type: Schema.Types.ObjectId,
    },
    admin_user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        default:"667b9e8904fdce67c119c046"
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'deleted','archived','inactive'],
        default: 'active'  // active, inactive, deleted, archived etc.
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

export const ProductModal = mongoose.model<IProductSchema>('products', productSchema);
