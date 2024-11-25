import { date } from 'joi';
import mongoose from 'mongoose';
export interface IUserSchema {
    username: string;
    password: string;
    email: string;
    dob: string;
    gender: string;
    status: string;
    actionType: string;
    createdAt: string;
}
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        default:null,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: String,
        default:null,
    },
    gender: {
        type: String,
        default:null
    },
    status: {
        type: String,
        default: 'active'
    },
    actionType: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

export const UserModel = mongoose.model<IUserSchema>('User', userSchema);
