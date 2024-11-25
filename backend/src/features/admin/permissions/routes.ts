import  express from "express"
import HandleErrors from "../../../middleware/handleErrors"
import { CreatePermission, GetPermission } from "./controllers"
import { validateRequest } from "../../../middleware/ValidationSchema"
import { CreatePermissionSchema } from "./validations"
const PermissionRouter=express.Router()
PermissionRouter.post('/create', validateRequest(CreatePermissionSchema),HandleErrors(CreatePermission))
PermissionRouter.get('/get', HandleErrors(GetPermission))

export default PermissionRouter;
