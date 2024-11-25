import mongoose, { ObjectId, Schema } from 'mongoose';

export interface IAddressSchema extends Document {
    user_id: ObjectId;
    pin:number;
    house_no:string;
    city: string;
    state: string;
    isDefault:boolean;
    createdAt: Date;
    updatedAt: Date;
}
const OrderSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    pin:{
        type: Number,
        required: true
    },
    house_no:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    isDefault:{
        type: Boolean,
        required: true,
        default: false
    }
},
{ timestamps: true })

export const AddressModel = mongoose.model<IAddressSchema>('address', OrderSchema);
