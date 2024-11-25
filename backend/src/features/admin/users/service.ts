import { IuserData, IuserEditData, IuserLoginData } from "./interfaces";
import bcrypt from 'bcrypt';
import { UserModel } from "./model/userModel";
import { UserHasRoleModel } from "./model/userHasRoles";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import { ObjectId } from "mongoose";
import EnvConfig from "../../../config/envConfig";
import { RoleModel } from "../roles/model/roleModel";
import { OrdersModel } from "../../user/products/modal/OrderModel";
const response: {
    message: string;
    data?: unknown;
    success: boolean;
} = { message: "", success: false };
class UserService {
    async UserCreate(userdata: IuserData) {
        try {
            const { username, password, email, dob, gender, role_id, status } = userdata;
            const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] }); // checks if user already exists or not by email or username beacause both are unique
            if (existingUser) {
                response.success = false;
                response.message = "User already exists";
                return response;
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new UserModel({
                username,
                email,
                password: hashedPassword,
                dob,
                gender,
                status,
                actionType: 'admin'
            });
            const userSaved = await user.save();
            const roleId = new mongoose.Types.ObjectId(role_id);// converting the string into object id
            if (userSaved) {
                const userhasrole = {
                    role_id: roleId,
                    user_id: userSaved._id
                }
                await UserHasRoleModel.insertMany(userhasrole)
                response.success = true;
                response.message = "User registered successfully";
                response.data = '';
            } else {
                response.success = false;
                response.message = "User not registered";
                response.data = '';
            }
            return response
        } catch (error) {
            response.success = false;
            response.message = "There is Problem in server Please Contact with the developer ";
            response.data = '';
        }
    }
    async UserLogin(data: IuserLoginData) {
        try {
            const { email, password } = data;
            const user = await UserModel.findOne({ email });
            if (user && user.status === 'inactive') {
                response.success = false;
                response.message = "User is inactive";
                response.data = '';
                return response;
            }
            if (user && user.actionType === 'user') {
                response.success = false;
                response.message = "User is not authorized to login";
                response.data = '';
                return response;
            }
            if (!user) {
                response.success = false;
                response.message = "User not found";
                response.data = '';
                return response;
            }
            // comparing its password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                response.success = false;
                response.message = "Incorrect password";
                response.data = '';
                return response;
            }
            // fetching user's role id
            const userRole = await UserHasRoleModel.findOne({ user_id: user._id });
            if (!userRole) {
                response.success = false;
                response.message = "User has no role assigned";
                response.data = '';
                return response;
            }
            const rolePermissions = await RoleModel.aggregate([
                {
                    $match: {
                        _id: userRole.role_id
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
                    $group: {
                        _id: "$_id",
                        name: { $first: "$name" },
                        permissions: {
                            $push: {
                                _id: "$permissions._id",
                                name: "$permissions.name"
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        permissions: {
                            $filter: {
                                input: "$permissions",
                                as: "permission",
                                cond: { $ne: ["$$permission._id", null] }
                            }
                        }
                    }
                }
            ]);
            const env = EnvConfig();
            const SecretKey = env.secretKey;
            const token = jwt.sign({ userEmail: user.email, UserId: user._id, RoleId: userRole.role_id }, process.env.JWT_SECRET || SecretKey, {
                expiresIn: '1h',
            });
            response.success = true;
            response.message = "User logged in successfully";
            response.data = {
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    token: token
                },
                role: rolePermissions[0],
            };
            return response;

        } catch (error) {
            response.success = false;
            response.message = "An error occurred during login";
            response.data = {};
            return response;
        }
    }
    async UserUpdate(id: string, data: IuserEditData) {
        try {
            const { username, email, dob, gender, role_id } = data;

            const updatedUser = await UserModel.findOneAndUpdate(
                { _id: id },
                {
                    username,
                    email,
                    dob,
                    gender,
                    actionType: "admin"
                },
                { new: true } // To return the updated document
            );

            const roleId = new mongoose.Types.ObjectId(role_id); // Converting the string into ObjectId

            if (updatedUser) {
                await UserHasRoleModel.updateOne(
                    { user_id: updatedUser._id },
                    { role_id: roleId },
                    { upsert: true } // To create a new document if none exists
                );
                response.success = true;
                response.message = "User updated successfully";
                response.data = updatedUser;
            } else {
                response.success = false;
                response.message = "User not found";
                response.data = '';
            }
            return response;
        } catch (error) {
            response.success = false;
            response.message = "There is a problem with the server. Please contact the developer.";
            response.data = error;
            return response;
        }
    }
    async UserRead(id: string) {
        try {
            const excludeId = new mongoose.Types.ObjectId('667b9e8904fdce67c119c046');
            const loggedInUserId = new mongoose.Types.ObjectId(id);
            const users = await UserModel.aggregate([
                {
                    $match: {
                        _id: { $nin: [excludeId, loggedInUserId] },
                        actionType: "admin"
                    }
                },
                {
                    $lookup: {
                        from: "userhasroles",
                        localField: "_id",
                        foreignField: "user_id",
                        as: "user_role"
                    }
                },
                {
                    $unwind: {
                        path: "$user_role",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "roles",
                        localField: "user_role.role_id",
                        foreignField: "_id",
                        as: "role"
                    }
                },
                {
                    $unwind: {
                        path: "$role",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        username: 1,
                        email: 1,
                        dob: 1,
                        gender: 1,
                        status: 1,
                        role: "$role.name"

                    }
                }
            ])
            response.success = true;
            response.message = "Users fetched successfully";
            response.data = users;
            return response;
        } catch (error) {
            response.success = false;
            response.message = "There is a problem with the server. Please contact the developer.";
            response.data = error;
            return response;
        }
    }
    async UserProfile(id: string) {
        try {
            const userid = new mongoose.Types.ObjectId(id);
            const user_data = await UserModel.aggregate([
                {
                    $match: {
                        _id: userid
                    }
                },
                {
                    $lookup: {
                        from: "userhasroles",
                        localField: "_id",
                        foreignField: "user_id",
                        as: "user_role"
                    }
                },
                {
                    $unwind: {
                        path: "$user_role",
                        includeArrayIndex: 'string',
                    }
                },
                {
                    $lookup: {
                        from: "roles",
                        localField: "user_role.role_id",
                        foreignField: "_id",
                        as: "role"
                    }
                },
                {
                    $unwind: {
                        path: "$role",
                        includeArrayIndex: 'string',
                    }
                },
                {
                    $project: {
                        username: 1,
                        dob: 1,
                        gender: 1,
                        role: "$role.name",
                        email: 1
                    }
                }
            ])
            response.success = true;
            response.message = "User profile fetched successfully";
            response.data = user_data;
            return response;
        } catch (error) {
            response.success = false;
            response.message = "There is a problem with the server. Please contact the developer.";
            response.data = error;
            return response;
        }
    }
    async UserStatusUpdate(id: string) {
        try {
            const userid = new mongoose.Types.ObjectId(id);
            const user = await UserModel.findById(userid);
            if (user) {
                const newStatus = user.status === 'active' ? 'inactive' : 'active';
                const updatedUser = await UserModel.findByIdAndUpdate(
                    userid,
                    { status: newStatus }
                );
                response.success = true;
                response.message = "User status updated successfully";
                response.data = updatedUser;
            } else {
                response.message = "User not found";
            }
            return response;
        } catch (error) {
            response.message = "There is a problem with the server. Please contact the developer.";
            response.data = error;
            return response;
        }
    }
    async UserEdit(id: string) {
        try {
            const userid = new mongoose.Types.ObjectId(id);
            const user = await UserModel.aggregate([
                {
                    $match: {
                        _id: userid
                    }
                },
                {
                    $lookup: {
                        from: "userhasroles",
                        localField: "_id",
                        foreignField: "user_id",
                        as: "user_role"
                    }
                },
                {
                    $unwind: {
                        path: "$user_role",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        username: 1,
                        email: 1,
                        dob: 1,
                        gender: 1,
                        status: 1,
                        password: 1,
                        role_id: "$user_role.role_id"
                    }
                }
            ]);
            if (user) {
                response.success = true;
                response.message = "User fetched successfully";
                response.data = user;
            } else {
                response.success = false;
                response.message = "User not found";
            }
            return response;
        } catch (error) {
            response.message = "There is a problem with the server. Please contact the developer.";
            response.data = error;
            return response;
        }
    }
    // CUSTOMER SERVICES
    async CustomerRead() {
        try {
            const customerServices = await UserModel.aggregate([
                {
                    $match: {
                        actionType: "user"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        username: 1,
                        email: 1,
                        dob: 1,
                        gender: 1,
                        status: 1,
                    }
                }
            ]);
            response.success = true;
            response.message = "Customer services fetched successfully";
            response.data = customerServices;
            return response;
        } catch (error) {
            response.success = false;
            response.message = "There is a problem with the server. Please contact the developer.";
            response.data = error;
            return response;
        }
    }

    async CustomerStatusUpdate(id: string) {
        try {
            const userId = new mongoose.Types.ObjectId(id);
            const OrderCheck = await OrdersModel.aggregate([
                {
                    $match: {
                        user_id: userId,
                        status: "Pending"
                    }
                }
            ]);

            if (OrderCheck.length > 0) {
                response.success = false;
                response.message = "Cannot update customer status. There are pending orders for this customer.";
                return response;
            }

            const customer = await UserModel.findById(userId);
            if (customer) {
                const newStatus = customer.status === 'active' ? 'inactive' : 'active';
                const updatedCustomer = await UserModel.findByIdAndUpdate(
                    userId,
                    { status: newStatus },
                    { new: true }
                );
                response.success = true;
                response.message = "Customer status updated successfully";
                response.data = updatedCustomer;
            } else {
                response.success = false;
                response.message = "Customer not found";
            }
            return response;
        } catch (error) {
            response.success = false;
            response.message = "There is a problem with the server. Please contact the developer.";
            response.data = error;
            return response;
        }

    }
}
export default new UserService