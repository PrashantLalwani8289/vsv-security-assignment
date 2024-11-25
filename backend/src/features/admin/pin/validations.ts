import Joi from "joi";
export const PinSchema = Joi.object({
    pin: Joi.number().required(),
    price: Joi.number().required(),
})
export const  ProductUpdateStatus=   Joi.object({
    id: Joi.string().required(), 
})
export const UpdateOrderStatus= Joi.object({
    status: Joi.string().required(), 
})