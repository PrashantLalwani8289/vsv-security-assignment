import  express from "express"
import HandleErrors from "../../../middleware/handleErrors"
import { verifyToken } from "../../../middleware/authMiddleware";
import { getDashboardData } from "./controller";
const DashboardRouter=express.Router()

DashboardRouter.get('/get-dashboard-data',verifyToken, HandleErrors(getDashboardData))
export default DashboardRouter;