import React, { useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Sidebar from "../sidebar";
import Navbar from "../navbar";
import axios from 'axios';
import PermissionMapped from '../../../routes/PermissionMapped';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state_management/store/store';
import { Bounce, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import routes from '../../../routes/routes';
const permissions: { [key: string]: string[] } = {
    user: ['user-create', 'user-read', 'user-update', 'user-delete'],
    roles: ['roles-create', 'roles-read', 'roles-update', 'roles-delete'],
    products: ['products-create', 'products-read', 'products-update', 'products-delete'],
    orders:['orders-read', 'orders-update'],
    customers:['customers-read', 'customers-update']
};

const schema = yup.object().shape({
    roleName: yup.string().required('Role name is required'),
    selectedPermissions: yup.object().shape({
        'user-create': yup.boolean(),
        'user-read': yup.boolean(),
        'user-update': yup.boolean(),
        'user-delete': yup.boolean(),
        'roles-create': yup.boolean(),
        'roles-read': yup.boolean(),
        'roles-update': yup.boolean(),
        'roles-delete': yup.boolean(),
        'products-create': yup.boolean(),
        'products-read': yup.boolean(),
        'products-update': yup.boolean(),
        'products-delete': yup.boolean(),
        'orders-read': yup.boolean(),
        'orders-update': yup.boolean(),
        'customers-read': yup.boolean(),
        'customers-update': yup.boolean()
    }),
});

interface FormValues {
    roleName: string;
    selectedPermissions: { [key: string]: boolean };
}

const AddRoles: React.FC = () => {
    const sidebarRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
        resolver: yupResolver(schema),
    });

    const selectedPermissions = watch('selectedPermissions') || {};

    const handleCategoryChange = (category: string) => {
        const updatedPermissions = { ...selectedPermissions };
        const categoryPermissions = permissions[category];
        const allSelected = categoryPermissions.every(permission => selectedPermissions[permission]);
        categoryPermissions.forEach(permission => {
            updatedPermissions[permission] = !allSelected;
        });
        setValue('selectedPermissions', updatedPermissions);
    };
    const TOKEN =useSelector((state: RootState) => state.root.token);
    const handleSubmitForm: SubmitHandler<FormValues> = (data) => {
        
        const permissionMap: { [key: string]: string } = PermissionMapped;
        const formData = {
            name:data.roleName,
            permission: Object.entries(data.selectedPermissions)
                .filter(([value]) => value)
                .map(([key]) => {
                    const permission = permissionMap[key];
                    if (!permission) {
                        console.error(`Permission not found for key: ${key}`);
                        return null;
                    }
                    return permission;
                }),
                
        };
        const AuthStr = 'Bearer '.concat(TOKEN);
        axios.post('http://localhost:5000/roles/create', formData, { headers: { Authorization: AuthStr }} ).then(res => {
            if(res.data.success===true) {
                toast.success('Role Added Successfully'), {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                }
                navigate(routes.ROLES)
            }else{
                toast.error('Failed to Add Role'), {
                    position: "top-center",
                    autoClose: 1000,
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
        <div className="wrapper">
            <Sidebar isAuthenticated={true} sidebarRef={sidebarRef}/>
            <div className="main">
                <Navbar sidebarRef={sidebarRef}/>
                <main className="content">
                    <div className="container-fluid p-0">
                        <h1 className="h3 mb-3">Roles Page</h1>
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
                                                        onClick={() => { navigate(routes.ROLES) }}
                                                    >Back</button>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit(handleSubmitForm)}>
                                            <div className="form-group">
                                                <label htmlFor="roleName">Role Name</label>
                                                <input
                                                    type="text"
                                                    id="roleName"
                                                    className="form-control"
                                                    {...register('roleName')}
                                                />
                                                {errors.roleName && <p className="text-danger">{errors.roleName.message}</p>}
                                            </div>
                                            <div className="form-group mt-3">
                                                <label>Permissions</label>
                                                <hr />
                                                <hr />

                                                {Object.keys(permissions).map(category => (
                                                    <div key={category} className="mt-2">
                                                        <div>
                                                            <input
                                                                type="checkbox"
                                                                id={category}
                                                                checked={permissions[category].every(permission => selectedPermissions[permission])}
                                                                onChange={() => handleCategoryChange(category)}
                                                            />
                                                            <label htmlFor={category} className="ml-2" style={{ padding: "5px" }}>{category}</label>
                                                        </div>
                                                        <div className="ml-4" style={{ display: "flex", gap: "20px" }}>
                                                            {permissions[category].map(permission => (
                                                                <div key={permission}>
                                                                    <input
                                                                        type="checkbox"
                                                                        id={permission}
                                                                        {...register(`selectedPermissions.${permission}`)}
                                                                        checked={selectedPermissions[permission] || false}
                                                                    />
                                                                    <label htmlFor={permission} className="ml-2" style={{ padding: "5px" }}>{permission}</label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <hr />
                                                    </div>
                                                ))}
                                                <hr />
                                            </div>
                                            <button type="submit" className="btn btn-primary mt-3">Add Role</button>
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

export default AddRoles;
