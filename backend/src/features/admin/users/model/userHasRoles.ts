import mongoose, { ObjectId, Schema } from 'mongoose';
export interface IUserHasRole{
    role_id:ObjectId,
    user_id:ObjectId
}
const userHasRoleSchema = new mongoose.Schema({
    role_id:{type: Schema.Types.ObjectId , required: true},
    user_id:{type: Schema.Types.ObjectId , required: true},
});

export const UserHasRoleModel = mongoose.model<IUserHasRole>('userHasRole', userHasRoleSchema);
