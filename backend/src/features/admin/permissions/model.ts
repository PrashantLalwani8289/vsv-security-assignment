import mongoose from 'mongoose';
export interface IPermissionSchema{
    name: string;
    createdAt:string;
}
const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    }
});

export const PermissionModel = mongoose.model<IPermissionSchema>('permissions', permissionSchema);
