import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Sidebar from "../sidebar";
import Navbar from "../navbar";
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state_management/store/store';
import routes from '../../../routes/routes';
import { postUserData, RolegetApi } from './UserInterface';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
    username: yup.string().required('Username is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    dob: yup.date().required('Date of Birth is required'),
    gender: yup.string().oneOf(['Male', 'Female'], 'Invalid gender').required('Gender is required'),
    role_id: yup.string().required('Role is required'),
});
const EditUser = () => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const TOKEN = useSelector((state: RootState) => state.root.token);
    const AuthStr = 'Bearer '.concat(TOKEN);
    const location = useLocation();

    const [roles, setRoles] = useState([]);
    
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver:yupResolver(schema),
        defaultValues: {
            username: "",
            dob: new Date(),
            gender: "Male",
            role_id: '',
        }
    });
    const getRoles = async () => {
        try {
            const res = await axios.get('http://localhost:5000/roles/get-all-roleData', { headers: { Authorization: AuthStr } });
            setRoles(res.data.data);
            // setValue('role_id', res.data.data[0]._id);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };
    // Fetch user details for editing
    const getUserById = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/user/user-edit/${ location.state.id}`, { headers: { Authorization: AuthStr } });
            const user = res.data.data;
            setValue('username', user[0].username);
            setValue('email', user[0].email);
            setValue('dob', user[0].dob);
            setValue('gender', user[0].gender);
            setValue('role_id', user[0].role_id);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };
    // Fetch roles for the dropdown
    
    useEffect(() => {
        getRoles();
        getUserById();
    }, [ ]);

    const onSubmit = async (data: postUserData) => {
        try {
            console.log(data)
            const res = await axios.put(`http://localhost:5000/user/user-update/${ location.state.id}`, data, { headers: { Authorization: AuthStr } });
            if (res.data.success) {
                toast.success('Product updated successfully');
                navigate(routes.USERS);
            } else {
                console.error('Failed to update user:', res.data.message);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Failed to update product');

        }
    };

    return (
        <div className="wrapper">
            <Sidebar isAuthenticated={true} sidebarRef={sidebarRef}/>
            <div className="main">
                <Navbar sidebarRef={sidebarRef}/>
                <main className="content">
                    <div className="container-fluid p-0">
                        <h1 className="h3 mb-3">Edit User</h1>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <button
                                            style={{
                                                padding: "5px",
                                                borderRadius: "5px",
                                                border: "1px solid #000",
                                                color: "#000",
                                                backgroundColor: "red",
                                            }}
                                            onClick={() => { navigate(routes.USERS) }}
                                        >
                                            Back
                                        </button>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className="form-group">
                                                <label htmlFor="username">Username</label>
                                                <input type="text" id="username" className="form-control" {...register('username')} />
                                                {errors.username && <p className="text-danger">{errors.username.message}</p>}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email">Email</label>
                                                <input type="email" id="email" className="form-control" {...register('email')} />
                                                {errors.email && <p className="text-danger">{errors.email.message}</p>}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="dob">Date of Birth</label>
                                                <input type="date" id="dob" className="form-control" {...register('dob')} />
                                                {errors.dob && <p className="text-danger">{errors.dob.message}</p>}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="gender">Gender</label>
                                                <select id="gender" className="form-control" {...register('gender')}>
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>
                                                {errors.gender && <p className="text-danger">{errors.gender.message}</p>}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="role_id">Role</label>
                                                <select id="role_id" className="form-control" {...register('role_id')}>
                                                    <option value="">Select Role</option>
                                                    {roles.map((role: RolegetApi) => (
                                                        <option key={role._id} value={role._id}>{role.name}</option>
                                                    ))}
                                                </select>
                                                {errors.role_id && <p className="text-danger">{errors.role_id.message}</p>}
                                            </div>
                                            <button type="submit" className="btn btn-primary mt-3">Submit</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default EditUser;
