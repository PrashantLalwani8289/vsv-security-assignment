import Joi from "joi";
export const querySchema= Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    search: Joi.string().allow('').default(''),
    category: Joi.string().allow('').default(''),
    sort: Joi.string().allow('').default(''),
});
export const AddCartSchema= Joi.object({
    product_id: Joi.string().required(),
    user_id: Joi.string().required(),
});
export const UpdateCartSchema= Joi.object({
    quantity: Joi.number().required(),
})