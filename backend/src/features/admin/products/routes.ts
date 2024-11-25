import  express from "express"
import HandleErrors from "../../../middleware/handleErrors"
import { verifyToken, checkPermission } from "../../../middleware/authMiddleware";
import { CREATE_PRODUCT_PERMISSIONS, READ_ORDER_PERMISSIONS, READ_PRODUCT_PERMISSIONS, UPDATE_ORDER_PERMISSIONS, UPDATE_PRODUCT_PERMISSIONS } from "../../../utils/CommonConstants";
import { CreateProduct, EditProduct, ExportProducts, ExportSampleExcel, ImportExcel, ReadOrder, ReadProduct, UpdateOrder, UpdateProduct, UpdateProductStatus } from "./controllers";
import multer from 'multer';
import { validateRequest } from "../../../middleware/ValidationSchema";
import { ProductSchema, ProductUpdateStatus, UpdateOrderStatus } from "./validations";
const ProductRouter=express.Router()
const storage = multer.memoryStorage(); // Use memory storage for testing purposes
const upload = multer({ storage });
ProductRouter.post('/create',validateRequest(ProductSchema), verifyToken ,checkPermission(CREATE_PRODUCT_PERMISSIONS), HandleErrors(CreateProduct))
ProductRouter.get('/read', verifyToken ,checkPermission(READ_PRODUCT_PERMISSIONS), HandleErrors(ReadProduct))
ProductRouter.get('/edit/:id', verifyToken ,checkPermission(UPDATE_PRODUCT_PERMISSIONS), HandleErrors(EditProduct))
ProductRouter.put('/update/:id', verifyToken ,validateRequest(ProductSchema), checkPermission(UPDATE_PRODUCT_PERMISSIONS), HandleErrors(UpdateProduct))
ProductRouter.post('/update-status', verifyToken ,validateRequest(ProductUpdateStatus),checkPermission(UPDATE_PRODUCT_PERMISSIONS), HandleErrors(UpdateProductStatus))

// import export products
ProductRouter.get('/export-products', verifyToken ,checkPermission(READ_PRODUCT_PERMISSIONS), HandleErrors(ExportProducts))
ProductRouter.get('/export-sample-excel', verifyToken ,checkPermission(READ_PRODUCT_PERMISSIONS), HandleErrors(ExportSampleExcel))
ProductRouter.post('/import-products', verifyToken ,checkPermission(CREATE_PRODUCT_PERMISSIONS), upload.single('file'),ImportExcel)


// Orders api routes
ProductRouter.get('/read-orders', verifyToken ,checkPermission(READ_ORDER_PERMISSIONS), HandleErrors(ReadOrder))
ProductRouter.put('/update-orders/:id', verifyToken ,validateRequest(UpdateOrderStatus) ,checkPermission(UPDATE_ORDER_PERMISSIONS), HandleErrors(UpdateOrder))

export default ProductRouter;

