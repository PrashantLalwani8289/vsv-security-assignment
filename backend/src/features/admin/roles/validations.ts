import Joi from "joi";
export const CreateRoleSchema = Joi.object({
    name: Joi.string().required(),
    permission: Joi.array().required(),
})