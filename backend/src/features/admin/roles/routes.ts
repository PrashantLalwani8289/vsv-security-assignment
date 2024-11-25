import  express from "express"
import HandleErrors from "../../../middleware/handleErrors"
import { CreateRole, GetAllRoles, GetAllRolesWithId, GetRoleById, UpdateRole } from "./controllers"
import { verifyToken, checkPermission } from "../../../middleware/authMiddleware";
import { CREATE_ROLE_PERMISSIONS, GET_ROLE_PERMISSIONS, UPDATE_ROLE_PERMISSIONS } from "../../../utils/CommonConstants";
import { validateRequest } from "../../../middleware/ValidationSchema";
import { CreateRoleSchema } from "./validations";
const RoleRouter=express.Router()


RoleRouter.post('/create', verifyToken ,validateRequest(CreateRoleSchema), checkPermission(CREATE_ROLE_PERMISSIONS), HandleErrors(CreateRole))
RoleRouter.get('/get-all-roles', verifyToken,checkPermission(GET_ROLE_PERMISSIONS), HandleErrors(GetAllRoles))
RoleRouter.get('/get-role/:roleId', verifyToken,checkPermission(GET_ROLE_PERMISSIONS), HandleErrors(GetRoleById))
RoleRouter.get('/get-all-roleData', verifyToken,checkPermission(GET_ROLE_PERMISSIONS), HandleErrors(GetAllRolesWithId))
RoleRouter.put('/update-role/:roleId', verifyToken,validateRequest(CreateRoleSchema), checkPermission(UPDATE_ROLE_PERMISSIONS), HandleErrors(UpdateRole))

export default RoleRouter;


