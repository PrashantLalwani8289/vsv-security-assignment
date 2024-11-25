import  express from "express"
import HandleErrors from "../../../middleware/handleErrors"
import { verifyToken } from "../../../middleware/authMiddleware";
import { CreatePin,  ExportSampleExcel,  ImportExcel,  ReadPin,  UpdatePin } from "./controllers";
import multer from 'multer';
import { validateRequest } from "../../../middleware/ValidationSchema";
import { PinSchema  } from "./validations";
const PinRouter=express.Router()
const storage = multer.memoryStorage(); // Use memory storage for testing purposes
const upload = multer({ storage });
PinRouter.post('/create',validateRequest(PinSchema), verifyToken , HandleErrors(CreatePin))
PinRouter.get('/read', verifyToken , HandleErrors(ReadPin))
PinRouter.put('/update/:id', verifyToken ,validateRequest(PinSchema), HandleErrors(UpdatePin))

// import export pin
PinRouter.get('/export-sample-excel', verifyToken , HandleErrors(ExportSampleExcel))
PinRouter.post('/import-pin', verifyToken , upload.single('file'),ImportExcel)

export default PinRouter;

