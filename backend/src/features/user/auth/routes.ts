import  express from "express"
import HandleErrors from "../../../middleware/handleErrors"
import { GetProfile, UpdateProfile, userLogin, UserRegister } from "./controllers"
import { verifyToken } from "../../../middleware/authMiddleware"
import { validateRequest } from "../../../middleware/ValidationSchema"
import { CustommerSchema } from "./validations"
const UserPanelRouter=express.Router()
UserPanelRouter.post('/register',  HandleErrors(UserRegister))
UserPanelRouter.post('/login',  HandleErrors(userLogin))
UserPanelRouter.get('/get-profile/:id', verifyToken, HandleErrors(GetProfile))
UserPanelRouter.put('/update-profile/:id',validateRequest(CustommerSchema), verifyToken, HandleErrors(UpdateProfile))

export default UserPanelRouter