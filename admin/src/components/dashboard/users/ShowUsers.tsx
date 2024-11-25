import Sidebar from "../sidebar";
import Navbar from "../navbar";
import { useNavigate } from "react-router-dom";
import routes from "../../../routes/routes";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../state_management/store/store";
import { GetUserData } from "./UserInterface";

const ShowUsers = () => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate()
    const [users, setUsers] = useState<GetUserData[]>([]); // Define state with user type
    const TOKEN = useSelector((state: RootState) => state.root.token);
    const AuthStr = 'Bearer '.concat(TOKEN);
    const statusChange = (data: string) => {
        const check = confirm('Are you sure you want to change status')
        if (check) {
            axios.post('http://localhost:5000/user/user-status-update', {id:data}, { headers: { Authorization: AuthStr } })
                .then(res => {
                    if(res.data.success)
                    GetUser()
                })
        }
    }
    const GetUser = () => {
        axios.get('http://localhost:5000/user/user-read', { headers: { Authorization: AuthStr } })
            .then(res => {
                setUsers(res.data.data)
            })
    }
    useEffect(() => {
        GetUser()
    }, [])
    return (
        <div className="wrapper">
            <Sidebar isAuthenticated={true} sidebarRef={sidebarRef}/>
            <div className="main">
                <Navbar sidebarRef={sidebarRef}/>
                <main className="content">
                    <div className="container-fluid p-0">
                        <h1 className="h3 mb-3">Users Page</h1>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title mb-0">User View</h5>
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
                                                        backgroundColor: "green",
                                                    }}
                                                        onClick={() => { navigate(routes.USERS_ADD) }}
                                                    >Add User</button>
                                                </div>
                                                <div className="table-responsive">
                                                    <table className="table table-hover my-0">
                                                        <thead>
                                                            <tr>
                                                                <th className="d-none d-xl-table-cell">Name</th>
                                                                <th className="d-none d-xl-table-cell">Email</th>
                                                                <th className="d-none d-xl-table-cell">Dob</th>
                                                                <th className="d-none d-xl-table-cell">Gender</th>
                                                                <th className="d-none d-xl-table-cell">Role</th>
                                                                <th className="d-none d-xl-table-cell">Status</th>
                                                                <th className="d-none d-md-table-cell">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {users.map(user => (
                                                                <tr key={user._id}>
                                                                    <td>{user.username}</td>
                                                                    <td >{user.email}</td>
                                                                    <td >{user.dob}</td>
                                                                    <td>{user.gender}</td>
                                                                    <td>{user.role}</td>
                                                                    <td style={{ cursor: "pointer" }} onClick={() => {
                                                                        statusChange(user._id as string)
                                                                    }}>{
                                                                            user.status === "active" ?
                                                                                <span className="badge bg-success">Active</span>
                                                                                :
                                                                                <span className="badge bg-danger">Inactive</span>

                                                                        }
                                                                    </td>
                                                                    <td className="d-none d-md-table-cell"><button style={{
                                                                        padding: "5px",
                                                                        borderRadius: "5px",
                                                                        border: "1px solid #000",
                                                                        color: "#000",
                                                                        backgroundColor: "green",
                                                                    }}
                                                                    onClick={()=>navigate(routes.USERS_EDIT,{state:{id: user._id}})}
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
    )
}

export default ShowUsers