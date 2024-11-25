import Joi from "joi";

export const CustommerSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    dob: Joi.string().required(),
    gender: Joi.string().required(),
})