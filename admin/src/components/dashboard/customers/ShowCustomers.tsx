import Sidebar from "../sidebar";
import Navbar from "../navbar";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../state_management/store/store";
import { useEffect, useRef, useState } from "react";
import { CustomerRead } from "./customersInterface";
import { toast } from "react-toastify";

const ShowCustomers = () => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const TOKEN = useSelector((state: RootState) => state.root.token);
    const [Customers, setCustomers] = useState<CustomerRead[]>([]);

    const ShowCustomersData = () => {
        axios.get('http://localhost:5000/user/customers-read', { headers: { Authorization: 'Bearer ' + TOKEN } })
            .then((res => {
                if (res.data.success) {
                    setCustomers(res.data.data);
                }
            }))
            .catch(error => {
                console.error("There was an error fetching the customers data!", error);
            });
    };

    useEffect(() => {
        ShowCustomersData();
    }, [TOKEN]);
    const statusChangeHandler=async(id:string)=>{
        const Isconfirm = confirm("Are you sure you want to update customers status?",)
        if(Isconfirm){
            await axios.post('http://localhost:5000/user/customers-update-status',{id:id}, { headers: { Authorization: 'Bearer ' + TOKEN } })
            .then(res=>{
                if(res.data.success) {
                    toast.success(res.data.message)
                    ShowCustomersData();
                }else{
                    toast.error(res.data.message)
                }
            })
        }
    }
    return (
        <div className="wrapper">
            <Sidebar isAuthenticated={true} sidebarRef={sidebarRef} />
            <div className="main">
                <Navbar sidebarRef={sidebarRef} />
                <main className="content">
                    <div className="container-fluid p-0">
                        <h1 className="h3 mb-3">Customers Page</h1>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title mb-0">Customers View</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="col-12 col-md-6 col-xxl-3 d-flex order-1 order-xxl-1" style={{ width: "100%" }}>
                                            <div className="card flex-fill">
                                                <div className="table-responsive">
                                                    <table className="table table-hover my-0">
                                                        <thead>
                                                            <tr>
                                                                <th className="d-none d-xl-table-cell">Id</th>
                                                                <th className="d-none d-xl-table-cell">Name</th>
                                                                <th className="d-none d-xl-table-cell">Email</th>
                                                                <th className="d-none d-xl-table-cell">Dob</th>
                                                                <th className="d-none d-xl-table-cell">Gender</th>
                                                                <th className="d-none d-xl-table-cell">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {Customers.map((customer, index) => {
                                                                return (
                                                                    <tr key={customer._id}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{customer.username}</td>
                                                                        <td>{customer.email}</td>
                                                                        <td>{ customer.dob}</td>
                                                                        <td>{customer.gender}</td>
                                                                        <td>
                                                                            {customer.status === "active" ? (
                                                                                <span className="badge bg-success" style={{ cursor:"pointer"}} onClick={()=>{
                                                                                    statusChangeHandler(customer._id as string)
                                                                                }}>Active</span>
                                                                            ) : (
                                                                                <span className="badge bg-danger"  style={{ cursor:"pointer"}} onClick={()=>{
                                                                                    statusChangeHandler(customer._id as string)
                                                                                }}>Inactive</span>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
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

export default ShowCustomers;
