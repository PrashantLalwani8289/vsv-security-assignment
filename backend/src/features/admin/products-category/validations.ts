import Joi from "joi";
export const PorductCatgeorySchema = Joi.object({
    name: Joi.string().required(),
})