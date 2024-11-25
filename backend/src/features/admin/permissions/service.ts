import { IPermissionCreate } from "./interfaces";
import { PermissionModel } from "./model";

const response: {
    message: string;
    data?: unknown;
    success: boolean;
} = { message: "", success: false };
class PermissionService {
    async CreatePermission(data: IPermissionCreate) {
        try {
            const { name } = data
            const permission = new PermissionModel({ name });
            const result = await permission.save();
            if (result) {
                response.success = true;
                response.message = "Permission Created successfully";
                response.data = '';
            } else {
                response.success = false;
                response.message = "Permission is not Cretaed";
                response.data = '';
            }
        } catch (error) {
            response.success = false;
            response.message = "An error occurred while creating the permission";
            response.data = '';
        }
        return response;
    }
    async GetPermission() {
        try {
            const result = await PermissionModel.find({},{
                name: 1, _id: 1
            }).sort({_id:-1});
            if (result) {
                response.success = true;
                response.message = "Permission Fetched successfully";
                response.data = result;
            } else {
                response.success = false;
                response.message = "Permission can not Fetched";
                response.data = '';
            }
        } catch (error) {
            response.success = false;
            response.message = "An error occurred while fetching the permission";
            response.data = '';
        }
        return response;
    }
}
export default new PermissionService
