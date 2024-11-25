import mongoose, { ObjectId, Schema } from 'mongoose';
export interface IRoleHasPermission{
    role_id:ObjectId,
    user_id:ObjectId
}
const RoleHasPermissionSchema = new mongoose.Schema({
    role_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    permission_id:{
        type: Schema.Types.ObjectId,
        required: true  
    }
});

export const RoleHasPermission = mongoose.model<IRoleHasPermission>('RoleHasPermission', RoleHasPermissionSchema);
