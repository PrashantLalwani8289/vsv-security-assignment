import mongoose, { ObjectId, Schema } from 'mongoose';
export interface ICartSchema{
    user_id:ObjectId;
    product_id:ObjectId;
    quantity: number;
    total_price: number;
    status:string;
    createdAt:string;
}

const CartSchema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    product_id:{
        type: Schema.Types.ObjectId,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    total_price:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum: ['Pending', 'Purchased','Deleted'],  // 0 means the product is in the cart 1  means that the product has been ordered
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

export const CartModel = mongoose.model<ICartSchema>('Cart', CartSchema);