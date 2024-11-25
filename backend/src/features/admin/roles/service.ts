import { PermissionModel } from "../permissions/model";
import { IRoleCreate } from "./interfaces";
import { RoleHasPermission } from "./model/roleHasPermission";
import { RoleModel } from "./model/roleModel";
import { ObjectId } from "mongoose";
import mongoose from "mongoose";
const response: {
    message: string;
    data?: unknown;
    success: boolean;
} = { message: "", success: false };
class RoleService {
    async CreateRole(data: IRoleCreate) {
        try {
            const { name, permission } = data;
            const role = new RoleModel({
                name
            });
            const savedRole = await role.save();
            const validPermissions = await PermissionModel.find({
                _id: { $in: permission }
            })
            // assigning permissions with the role
            const rolePermissions = validPermissions.map(permission => ({
                role_id: savedRole._id,
                permission_id: permission._id
            }));
            await RoleHasPermission.insertMany(rolePermissions);
            response.message = "Role created successfully with permissions";
            response.data = {};
            response.success = true;
            return response;
        } catch (error) {
            response.message = "Failed to create role";
            response.success = false;
            response.data = {};
            return response;
        }
    }
    async GetAllRoles() {
        try {
            const excludeId = new mongoose.Types.ObjectId('667aa4c6d03f6b2d4556f4d0');

            const roles = await RoleModel.aggregate([
                {
                    $match:{
                        _id: { $nin:[excludeId] }
                    }
                },
                {
                    $lookup: {
                        from: "rolehaspermissions",
                        localField: "_id",
                        foreignField: "role_id",
                        as: "role_permissions"
                    }
                },
                {
                    $unwind: {
                        path: "$role_permissions",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "permissions",
                        localField: "role_permissions.permission_id",
                        foreignField: "_id",
                        as: "permission_details"
                    }
                },
                {
                    $unwind: {
                        path: "$permission_details",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "userhasroles",
                        localField: "_id",
                        foreignField: "role_id",
                        as: "role_users"
                    }
                },
                {
                    $unwind: {
                        path: "$role_users",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "role_users.user_id",
                        foreignField: "_id",
                        as: "user_details"
                    }
                },
                {
                    $unwind: {
                        path: "$user_details",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        name: { $first: "$name" },
                        permissions: {
                            $addToSet: {
                                _id: "$permission_details._id",
                                name: "$permission_details.name"
                            }
                        },
                        users: {
                            $addToSet: {
                                _id: "$user_details._id",
                                email: "$user_details.email",
                                username: "$user_details.username"
                            }
                        }
                    }
                },
                {
                    $sort:{_id:-1}
                }
            ]);
    
            response.message = "Roles fetched successfully";
            response.data = roles;
            response.success = true;
            return response;
        } catch (error) {
            response.message = "Failed to fetch roles";
            response.success = false;
            response.data = {};
            return response;
        }
    }
    async GetRoleById(id: string) {
        try {
            const check = await RoleModel.findById(id);
            if (check) {
                const roleId = new mongoose.Types.ObjectId(id);
                const role = await RoleModel.aggregate([
                    {
                        $match: {
                            _id: roleId
                        }
                    },
                    {
                        $lookup: {
                            from: "rolehaspermissions",
                            localField: "_id",
                            foreignField: "role_id",
                            as: "permissions"
                        }
                    },
                    {
                        $unwind: {
                            path: "$permissions",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $lookup: {
                            from: "permissions",
                            localField: "permissions.permission_id",
                            foreignField: "_id",
                            as: "permissions.permission_details"
                        }
                    },
                    {
                        $unwind: {
                            path: "$permissions.permission_details",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $group: {
                            _id: "$_id",
                            name: { $first: "$name" },
                            permissions: {
                                $push: {
                                    _id: "$permissions.permission_details._id",
                                    name: "$permissions.permission_details.name"
                                }
                            }
                        }
                    }
                ]);
                response.message = "Roles fetched successfully";
                response.data = role;
                response.success = true;
                return response;
            } else {
                response.message = "Role not found";
                response.success = false;
                response.data = {};
                return response;
            }

        } catch (error) {
            response.message = "Failed to fetch roles";
            response.success = false;
            response.data = {};
            return response;
        }
    }
    async UpdateRole(id: string, data: IRoleCreate) {
        try {
            const { name, permission } = data;
            const roleId = new mongoose.Types.ObjectId(id);
            const role = await RoleModel.findByIdAndUpdate(roleId, { name }, { new: true });
            if (role) {
                const validPermissions = await PermissionModel.find({
                    _id: { $in: permission }
                })
                // assigning permissions with the role
                const rolePermissions = validPermissions.map(permission => ({
                    role_id: role._id,
                    permission_id: permission._id
                }));
                await RoleHasPermission.deleteMany({ role_id: role._id });
                await RoleHasPermission.insertMany(rolePermissions);
                response.message = "Role updated successfully with permissions";
                response.data = {};
                response.success = true;
                return response;
            }else{
                response.message = "Role not found";
                response.success = false;
                response.data = {};
                return response;
            }
        } catch (error) {
            response.message = "Failed to update role";
            response.success = false;
            response.data = {};
            return response;
        }
    }
    async GetAllRolesWithId(){
        try {
            const roles = await RoleModel.find({},{_id:1,name:1});
            response.message = "Roles fetched successfully";
            response.data = roles;
            response.success = true;
            return response;
        } catch (error) {
            response.message = "Failed to fetch roles";
            response.success = false;
            response.data = {};
            return response;
        }
    }
}
export default new RoleService