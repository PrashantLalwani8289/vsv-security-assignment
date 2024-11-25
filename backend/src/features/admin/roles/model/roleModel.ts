import mongoose from 'mongoose';
export interface IRoleSchema{
    name: string;
    createdAt:string;
}
const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdAT:{
        type: Date,
        default: Date.now()
    }
});

export const RoleModel = mongoose.model<IRoleSchema>('Roles', roleSchema);
