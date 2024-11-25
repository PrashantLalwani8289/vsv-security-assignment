import React, { useEffect, useRef, useState } from 'react';
import Sidebar from "../sidebar";
import Navbar from "../navbar";
import axios from "axios";
import { Role } from './RoleInterface';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state_management/store/store';
import '../../../../public/adminKit/js/app.js'
import { useNavigate } from 'react-router-dom';
import routes from '../../../routes/routes.js';

const ShowRoles: React.FC = () => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const navigate =useNavigate();
    const [roles, setRoles] = useState<Role[]>([]); // Define state with Role type

    const TOKEN =useSelector((state: RootState) => state.root.token);

    const GetRoleData = async () => {
        const AuthStr = 'Bearer '.concat(TOKEN);
        try {
            const res = await axios.get('http://localhost:5000/roles/get-all-roles', { headers: { Authorization: AuthStr } });
            setRoles(res.data.data); // Set fetched roles data to state
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    useEffect(() => {
        GetRoleData();
    }, []);

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
                                        <h5 className="card-title mb-0">Roles View</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="col-12 col-md-6 col-xxl-3 d-flex order-1 order-xxl-1" style={{ width: "100%" }}>
                                            <div className="card flex-fill">
                                                <div className="card-header">
                                                    <button style={{
                                                        padding: "5px",
                                                        borderRadius: "5px",
                                                        border: "1px solid #000",
                                                        color: "#000",
                                                        backgroundColor: "#17a2b8",
                                                    }}
                                                    onClick={()=>{ navigate(routes.ROLES_ADD)}}
                                                    >Add Role</button>
                                                </div>
                                                <div className="table-responsive">
                                                    <table className="table table-hover my-0">
                                                        <thead>
                                                            <tr>
                                                                <th>Name</th>
                                                                <th className="d-none d-xl-table-cell">Permissions</th>
                                                                <th className="d-none d-xl-table-cell">Users Assigned</th>
                                                                <th className="d-none d-md-table-cell">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {roles.map(role => (
                                                                <tr key={role._id}>
                                                                    <td>{role.name}</td>
                                                                    <td>
                                                                        {role.permissions.map(permission => (
                                                                            <span key={permission._id} className="badge bg-info" style={{ margin:"2px"}}>
                                                                                {permission.name}
                                                                            </span>
                                                                        ))}
                                                                    </td>
                                                                    <td>
                                                                        {role.users.map(user => (
                                                                            <span key={user._id} className="badge bg-success" style={{ margin:"2px"}}>
                                                                                {user.username}
                                                                            </span>
                                                                        ))}
                                                                    </td>
                                                                    <td>
                                                                        <button style={{
                                                                            padding: "5px",
                                                                            borderRadius: "5px",
                                                                            border: "1px solid #000",
                                                                            color: "#000",
                                                                            backgroundColor: "green",
                                                                        }}
                                                                        onClick={()=>navigate(routes.ROLES_EDIT,{state:{id:role._id}})}
                                                                        >Edit</button>
                                                                        {/* <button style={{
                                                                            marginLeft: "5px",
                                                                            padding: "5px",
                                                                            borderRadius: "5px",
                                                                            border: "1px solid #000",
                                                                            color: "#000",
                                                                            backgroundColor: "red",
                                                                        }}>Delete</button> */}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
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

export default ShowRoles;
