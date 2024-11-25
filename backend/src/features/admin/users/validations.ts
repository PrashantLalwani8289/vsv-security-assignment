import Joi from "joi";
export const UserSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    dob: Joi.string().required(),
    gender: Joi.string().required(),
})
export const UserStatusUpdateSchema = Joi.object({
    id: Joi.string().required(),
})