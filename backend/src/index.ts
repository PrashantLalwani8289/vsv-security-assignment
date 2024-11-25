import express from "express";
import envConfig from "./config/envConfig";
import connectDB from "./db/dbConnect";
import bodyParser from "body-parser";
import cors from "cors"
import PermissionRouter from "./features/admin/permissions/routes";
import RoleRouter from "./features/admin/roles/routes";
import UserRouter from "./features/admin/users/routes";
import ProductCategoryRouter from "./features/admin/products-category/routes";
import ProductRouter from "./features/admin/products/routes";
import UserPanelRouter from "./features/user/auth/routes";
import UserProductRouter from "./features/user/products/routes";
import DashboardRouter from "./features/admin/dashboard/routes";
import PinRouter from "./features/admin/pin/routes";


const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));


const env = envConfig();
const port = env.port;
connectDB()
app.use(cors({
    origin: "*",
    credentials: true
}));

app.use("/permission", PermissionRouter);
app.use("/roles", RoleRouter);
app.use("/user", UserRouter);
app.use("/product-category", ProductCategoryRouter);
app.use("/product", ProductRouter);
app.use("/dashboard", DashboardRouter);
app.use("/pin", PinRouter);

// user-panel routes
app.use('/', UserPanelRouter, UserProductRouter)

app.listen(port, () => {
    console.log("server is running on port http://localhost:" + port);
});

// app.get('/api/analytics', async (req: Request, res: Response) => {
//     try {
//         const response = await analytics.properties.runReport({
//             auth,
//             requestBody: {
//                 property: 'properties/8471995080',
//                 dimensions: [{ name: 'pageTitle' }],
//                 metrics: [{ name: 'activeUsers' }],
//                 dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
//             },
//         });
//         console.log(response.data);
//         res.json(response.data);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send(error);
//     }
// });
