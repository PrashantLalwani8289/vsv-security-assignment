import Joi from "joi";
export const ProductSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    category_id: Joi.string().required(),
    description: Joi.string().required(),
    quantity: Joi.number().required(),
    image: Joi.any().required()
})
export const  ProductUpdateStatus=   Joi.object({
    id: Joi.string().required(), 
})
export const UpdateOrderStatus= Joi.object({
    status: Joi.string().required(), 
})