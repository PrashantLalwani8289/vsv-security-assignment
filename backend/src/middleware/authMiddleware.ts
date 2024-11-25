import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import envConfig from '../config/envConfig';
import { UserHasRoleModel } from '../features/admin/users/model/userHasRoles';
import { RoleModel } from '../features/admin/roles/model/roleModel';

export interface CustomRequest extends Request {
    userEmail?: string | JwtPayload;
    UserId?: string | JwtPayload;
    RoleId?: string | JwtPayload;
}

const response: {
    message: string;
    success: boolean;
} = { message: "", success: false };

const env = envConfig();
const SecretKey = env.secretKey;

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization');

    if (!token) {
        res.status(401).json({ error: 'Access denied' });
        return;
    }

    try {
        const newToken = token.split(" ")[1];
        const decoded = jwt.verify(newToken, SecretKey) as JwtPayload;
        req.userEmail = decoded.userEmail;
        req.RoleId = decoded.RoleId;
        req.UserId = decoded.UserId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

const checkPermission = (requiredPermissions: string[]) => {
    return async (req: CustomRequest, res: Response, next: NextFunction) => {
        const userId = req.UserId;
        
        if (!userId) {
            response.message = "User not found.";
            response.success = false;
            return res.status(403).json(response);
        }

        try {
            const userRole = await UserHasRoleModel.findOne({ user_id: userId });
            if (!userRole) {
                response.message = "Access Denied.";
                response.success = false;
                return res.status(403).json(response);
            }

            const rolePermissions = await RoleModel.aggregate([
                {
                    $match: {
                        _id: userRole.role_id,
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
                        permissions: {
                            $push: {
                                _id: "$permissions._id",
                                name: "$permissions.name"
                            }
                        }
                    }
                }
            ]);

            const userPermissions = rolePermissions[0]?.permissions.map((p: any) => p.name) || [];
            const hasPermission = requiredPermissions.every(permission =>
                userPermissions.includes(permission)
            );

            if (!hasPermission) {
                response.message = "Access denied. You do not have the required permissions.";
                response.success = false;
                return res.status(403).json(response);
            }

            next();
        } catch (error) {
            response.message = "An error occurred while checking permissions.";
            response.success = false;
            return res.status(500).json(response);
        }
    };
};

export { verifyToken, checkPermission };
