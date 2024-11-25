import { array } from 'joi';
import mongoose, { ObjectId, Schema } from 'mongoose';
export interface ICartSchema extends Document {
    cart_id: ObjectId;
}
export interface IOrderSchema extends Document {
    user_id: ObjectId;
    cart_id: ICartSchema[];
    address_id: ObjectId;
    total_price: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
const OrderSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    address_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    cart_id: [{
        type: String,
        required: true
    }],
    total_price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Completed","Pending","Rejected","Shipped"],
        default:"Pending",
        required: true
    }
},
{ timestamps: true })
export const OrdersModel = mongoose.model<IOrderSchema>('orders', OrderSchema);
