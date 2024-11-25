import mongoose, { ObjectId, Schema } from 'mongoose';
export interface IPinSchema{
    pin: number;
    price: number;
}
const pinSchema = new mongoose.Schema({
    pin: {
        type: Number,
        required: true,
        unique:true
    },
    price: {
        type: Number,
        required: true
    },
},{
    timestamps:true
}

);

export const PinModal = mongoose.model<IPinSchema>('pin', pinSchema);
