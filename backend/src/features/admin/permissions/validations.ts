import Joi from "joi";
export const CreatePermissionSchema = Joi.object({
    name: Joi.string().required(),
})