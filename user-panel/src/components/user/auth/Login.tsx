import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from 'yup';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { UserLogin } from "./UserInterface";
import routes from "../../../routes/routes";
import { login } from "../../../state_management/actions/rootReducer";
const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required().matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    )
})
const Login = () => {
    const ClientId = "763033723945-4jf16tnnn3ta5p82k0auh75o1n5o09du.apps.googleusercontent.com";
    const { register, handleSubmit, formState: { errors } } = useForm<UserLogin>({
        resolver: yupResolver(schema)
    })
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            axios.post('http://localhost:5000/login', { token: credentialResponse.credential }).then(res => {
                if (res.data.success === true) {
                    toast.success('LoggIn Successfull')
                    dispatch(login(res.data.data.user))
                    navigate(routes.HOME)
                } else {
                    toast.error(res.data.message)
                }
            }).catch(err => {
                console.log(err);
            })
        } catch (error) {
            console.error('Google Signup Failed', error);
        }
    };
    const handleGoogleSignupError = () => {
        console.error('Google Signup Failed');
    };
    const onSubmit = (data: UserLogin) => {
        axios.post('http://localhost:5000/login', data).then(res => {
            if (res.data.success === true) {
                toast.success('LoggIn Successfull'), {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                }
                dispatch(login(res.data.data.user))
                navigate(routes.HOME)
            } else {
                toast.error(res.data.message), {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                }
            }
        })
    };
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: '500px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' , backgroundColor:"#f0f8ff" }} noValidate>
                <div><h1 style={{ color: "#556cd6" }} >Login</h1></div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                    <input
                        {...register('email')}
                        id="email"
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                    {errors.email && <p style={{ color: 'red', marginTop: '5px' }}>{errors.email.message}</p>}
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                    <input
                        {...register('password')}
                        id="password"
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                    {errors.password && <p style={{ color: 'red', marginTop: '5px' }}>{errors.password.message}</p>}
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#556cd6', color: '#fff', border: 'none', borderRadius: '5px' }}>Login</button>
                <div style={{ marginTop: '15px' }}>New User?
                    <Link to="/register" >Register</Link>
                </div>
                <GoogleOAuthProvider clientId={ClientId}>
                    <div>
                        <p></p>
                        <GoogleLogin
                            onSuccess={handleGoogleLoginSuccess}
                            onError={handleGoogleSignupError}
                        />
                    </div>
                </GoogleOAuthProvider>
            </form>
        </div>
    )
}

export default Login