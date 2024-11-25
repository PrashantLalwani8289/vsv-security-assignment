import EnvConfig from "../../../config/envConfig";
import { UserModel } from "../../admin/users/model/userModel";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { IGoogleCredential, IProfileData, IUserLogin, IUserRegister, QueryParams } from "./interface";
const response: {
    message: string;
    data?: unknown;
    success: boolean;
} = { message: "", success: false };
function isISignUp(data: unknown): data is IUserRegister {
    return (data as IUserRegister).username !== undefined &&
        (data as IUserRegister).email !== undefined &&
        (data as IUserRegister).password !== undefined &&
        (data as IUserRegister).dob !== undefined &&
        (data as IUserRegister).gender !== undefined;
}
function isIGoogleCredential(data: unknown): data is IGoogleCredential {
    return (data as IGoogleCredential).token !== undefined;
}
function isILogIn(data: unknown): data is IUserLogin {
    return (data as IUserLogin).email !== undefined &&
        (data as IUserLogin).password !== undefined;
}
class UserPanelService{
    async userRegister(userdata: IUserRegister) {
        if (isISignUp(userdata)) {
            const { username, password, email, dob, gender } = userdata;
            const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] }); 
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
            });
            const res = await user.save();
            if (res) {
                response.success = true;
                response.message = "User registered successfully";
                response.data = '';

            } else {
                response.success = false;
                response.message = "User not registered";
                response.data = '';

            }
        } else if (isIGoogleCredential(userdata)) {
            const env = EnvConfig();
            const SecretKey = env.secretKey;
            const { token } = userdata;
            if (token) {
                const decodedData = jwt.decode(token) as { email: string; given_name: string };
                const email = decodedData.email
                const existingUser = await UserModel.findOne({ email }); 
                if (existingUser) {
                    response.message = "User already exists";
                    response.success = false;
                    response.data = null;
                    return response;
                }
                const username = decodedData.given_name
                const newUser = new UserModel({
                    username: username,
                    email: email,
                    password: null,
                    dob: null,
                    gender: null,
                });
                console.log(newUser)
                const savedUser = await newUser.save();
                console.log(savedUser)
                const Newtoken = jwt.sign({ userEmail: savedUser.email, UserId:savedUser._id}, process.env.JWT_SECRET || SecretKey, {
                    expiresIn: '1h',
                });
                response.success = true;
                response.message = "User logged in successfully";
                response.data = {
                    user: {
                        id: savedUser._id,
                        username: savedUser.username,
                        email: savedUser.email,
                        token: Newtoken,
                    },
                };
            }
        }

        return response;
    }
    async userLogin(LoginData: IUserLogin) {
        if (isILogIn(LoginData)) {
            const { email, password } = LoginData;
            const user = await UserModel.findOne({ email });
            if (user && user.status === 'inactive') {
                response.success = false;
                response.message = "User is inactive";
                response.data = '';
                return response;
            }
            if (user && user.status === 'inactive' ) {
                response.success = false;
                response.message = "User is not valid";
                response.data = '';
                return response;
            }
            if (user) {
                const validPassword = await bcrypt.compare(password, user.password);
                if (validPassword) {
                    const env = EnvConfig();
                    const SecretKey = env.secretKey;
                    // generate the jwt token
                    const token = jwt.sign({ userEmail: user.email, UserId:user._id }, process.env.JWT_SECRET || SecretKey, {
                        expiresIn: '1h',
                    });
                    response.success = true;
                    response.message = "User logged in successfully";
                    response.data = {
                        
                        user: {
                            id: user._id,
                            username: user.username,
                            email: user.email,
                            token: token,
                        },
                    };
                } else {
                    response.success = false;
                    response.message = "Invalid password";
                    response.data = '';
                }
            } else {
                response.success = false;
                response.message = "User not found";
                response.data = '';
            }
        }
        else if(isIGoogleCredential(LoginData)){
            const env = EnvConfig();
            const SecretKey = env.secretKey;
            const { token } = LoginData;
            if (token) {
                const decodedData = jwt.decode(token) as { email: string; given_name: string };
                const email = decodedData.email
                const user = await UserModel.findOne({ email });

                if (user && user.status === 'inactive') {
                    response.success = false;
                    response.message = "User is inactive";
                    response.data = '';
                    return response;
                }
                if (user && user.actionType === 'admin') {
                    response.success = false;
                    response.message = "User is not authorized";
                    response.data = '';
                    return response;
                }
                if (user) {
                    const token = jwt.sign({ userEmail: user.email, UserId: user._id }, process.env.JWT_SECRET || SecretKey, {
                        expiresIn: '1h',
                    });
                    response.success = true;
                    response.message = "User logged in successfully";
                    response.data = {
                        
                        user: {
                            id: user._id,
                            username: user.username,
                            email: user.email,
                            token: token,
                        },
                    };
                } else {
                    response.success = false;
                    response.message = "User not found";
                    response.data = '';
                }
            }

        }
        return response;
    }
    async GetProfile(id: string) {
        const user = await UserModel.findById(id,{_id:1,username:1,dob:1,gender:1,email:1});
        if (user) {
            response.success = true;
            response.message = "User profile fetched successfully";
            response.data = user;
        } else {
            response.success = false;
            response.message = "User not found";
            response.data = null;
        }
        return response;
    }
    async UpdateProfile(id: string, updatedData: IProfileData) {
            const user = await UserModel.findByIdAndUpdate(id, updatedData, { new: true });
            if (user) {
                response.success = true;
                response.message = "User profile updated successfully";
                response.data = user;
            } else {
                response.success = false;
                response.message = "User not found";
                response.data = null;
            }
        return response;
    }
}
export default new UserPanelService