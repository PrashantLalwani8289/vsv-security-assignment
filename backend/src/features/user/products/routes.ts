import  express from "express"
import HandleErrors from "../../../middleware/handleErrors"
import { AddAddress, AddCart, AddOrder, CheckPin, DeleteCart, EmptyCart, GetAddress, GetAllOrder, GetCart, GetCategory, GetOrder, GetProducts, GetProductsCart, UpdateAddressStatus, UpdateCart } from "./controllers"
import { verifyToken } from "../../../middleware/authMiddleware"
import { validateRequest } from "../../../middleware/ValidationSchema"
import { AddCartSchema, querySchema, UpdateCartSchema } from "./validations"
const UserProductRouter=express.Router()


// home page
UserProductRouter.get('/get-product',validateRequest(querySchema,"query"), HandleErrors(GetProducts))
UserProductRouter.get('/get-category', HandleErrors(GetCategory))
UserProductRouter.get('/get-product-cart', verifyToken,HandleErrors(GetProductsCart))
UserProductRouter.post('/check-pin', verifyToken,HandleErrors(CheckPin))

// cart
UserProductRouter.post('/addCart',validateRequest(AddCartSchema), verifyToken ,HandleErrors(AddCart))
UserProductRouter.get('/GetCart/:id', verifyToken ,HandleErrors(GetCart))
UserProductRouter.put('/update-cart/:id',validateRequest(UpdateCartSchema), verifyToken ,HandleErrors(UpdateCart))
UserProductRouter.delete('/delete-cart-item/:id', verifyToken ,HandleErrors(DeleteCart))
UserProductRouter.delete('/empty-cart/:id', verifyToken ,HandleErrors(EmptyCart))

// chechout
UserProductRouter.get('/get-order/:id', verifyToken,HandleErrors(GetOrder))


// orders
UserProductRouter.post('/add-order', verifyToken ,HandleErrors(AddOrder))
UserProductRouter.get('/get-all-order', verifyToken ,HandleErrors(GetAllOrder))

// address
UserProductRouter.post('/add-address', verifyToken ,HandleErrors(AddAddress))
UserProductRouter.get('/get-address', verifyToken ,HandleErrors(GetAddress))
UserProductRouter.put('/update-address-status/:id', verifyToken ,HandleErrors(UpdateAddressStatus))

export default UserProductRouter