import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Sidebar from "../sidebar";
import Navbar from "../navbar";
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state_management/store/store';
import { RolegetApi, postUserData } from './UserInterface';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import routes from '../../../routes/routes';

const schema = yup.object().shape({
    username: yup.string().required('Username is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    dob: yup.date().required('Date of Birth is required'),
    gender: yup.string().oneOf(['Male', 'Female'], 'Invalid gender').required('Gender is required'),
    role_id: yup.string().required('Role is required'),
    status: yup.string().oneOf(['active', 'inactive'], 'Invalid status').required('status is required'),
});

const CreateUsers = () => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate()
    const TOKEN = useSelector((state: RootState) => state.root.token);
    const AuthStr = 'Bearer '.concat(TOKEN);
    const [role, setRole] = useState([]);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: postUserData) => {
        console.log(data);
        axios.post('http://localhost:5000/user/user-create', data, { headers: { Authorization: AuthStr } })
            .then(res => {
                if (res.data.success === true) {
                    toast.success('Role Added Successfully')
                    navigate(routes.USERS)
                } else {
                    toast.error('Failed to Add Role')
                }
            })
    };
    //  geeting role through api
    const fetchRole = async () => {
        try {
            const response = await axios.get('http://localhost:5000/roles/get-all-roleData', { headers: { Authorization: AuthStr } });
            setRole(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchRole();
    }, []);
    return (
        <div className="wrapper">
            <Sidebar isAuthenticated={true} sidebarRef={sidebarRef}/>
            <div className="main">
                <Navbar sidebarRef={sidebarRef}/>
                <main className="content">
                    <div className="container-fluid p-0">
                        <h1 className="h3 mb-3">User Page</h1>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <button style={{
                                            padding: "5px",
                                            borderRadius: "5px",
                                            border: "1px solid #000",
                                            color: "#000",
                                            backgroundColor: "red",
                                        }}
                                            onClick={() => { navigate(routes.USERS) }}
                                        >Back</button>
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
                                                <label htmlFor="password">Password</label>
                                                <input type="password" id="password" className="form-control" {...register('password')} />
                                                {errors.password && <p className="text-danger">{errors.password.message}</p>}
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
                                                <label htmlFor="status">status</label>
                                                <select id="status" className="form-control" {...register('status')}>
                                                    <option value="">Select status</option>
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                                {errors.status && <p className="text-danger">{errors.status.message}</p>}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="role_id">Role</label>
                                                <select id="role_id" className="form-control" {...register('role_id')}>
                                                    <option value="">Select Role</option>
                                                    {role.map((role: RolegetApi) => (
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
};

export default CreateUsers;
