import Sidebar from "../sidebar";
import Navbar from "../navbar";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../state_management/store/store";
import { useEffect, useRef, useState } from "react";
import { OrderRead } from "./orderInterface";
const Orders = () => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const TOKEN = useSelector((state: RootState) => state.root.token);
    const AuthStr = 'Bearer '.concat(TOKEN);
    const [Orders, setOrders] = useState<OrderRead[]>([]);
    const GetOrders = () => {
        axios.get('http://localhost:5000/product/read-orders', { headers: { Authorization: AuthStr } })
            .then(res => setOrders(res.data.data))
    }
    useEffect(() => {
        GetOrders()
    }, [])
    const updateOrderStatus = async (orderId: string, newStatus: 'Pending' | 'Shipped' | 'Completed' | 'Rejected') => {
        try {
            await axios.put(`http://localhost:5000/product/update-orders/${orderId}`, { status: newStatus }, { headers: { Authorization: AuthStr } })
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
            GetOrders()
        } catch (err) {
            console.error('Failed to update order status', err);
        }
    };
    return (
        <div className="wrapper">
            <Sidebar isAuthenticated={true} sidebarRef={sidebarRef} />
            <div className="main">
                <Navbar sidebarRef={sidebarRef} />
                <main className="content">
                    <div className="container-fluid p-0">
                        <h1 className="h3 mb-3">Order  Page</h1>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title mb-0">Order View</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="col-12 col-md-6 col-xxl-3 d-flex order-1 order-xxl-1" style={{ width: "100%" }}>
                                            <div className="card flex-fill">
                                                <div className="table-responsive">
                                                    <table className="table table-hover my-0">
                                                        <thead>
                                                            <tr>
                                                                <th className="d-none d-xl-table-cell">Order_id</th>
                                                                <th className="d-none d-xl-table-cell">User</th>
                                                                <th className="d-none d-xl-table-cell">Total price</th>
                                                                <th className="d-none d-xl-table-cell">Products</th>
                                                                <th className="d-none d-xl-table-cell">Address</th>
                                                                <th className="d-none d-xl-table-cell">Status</th>
                                                                <th className="d-none d-xl-table-cell">Order At</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {Orders?.map((order, index) => {
                                                                const ts = new Date(order.createdAt);
                                                                const isValidDate = !isNaN(ts.getTime());
                                                                if (!isValidDate) {
                                                                    console.error('Invalid date:', order.createdAt);
                                                                    return null; // Skip this order
                                                                }
                                                                const formattedDate = ts.toLocaleDateString();
                                                                return (
                                                                    <tr key={index}>
                                                                        <td>{order._id}</td>
                                                                        <td>{order.user_name}</td>
                                                                        <td>₹{order.total_price}</td>
                                                                        <td>{order.products.map((product) => (
                                                                            <>
                                                                                <p> <span style={{ fontWeight: "bold" }}> name: </span>{product.name}  <span style={{ fontWeight: "bold" }}> price:₹ </span> {product.price}  <span style={{ fontWeight: "bold" }}> quantity: </span>{product.quantity} <span style={{ fontWeight: "bold" }}> total Price:₹ </span> {product.total_price}</p>
                                                                            </>
                                                                        ))}</td>
                                                                        <td>
                                                                            <>
                                                                                <p> {order.address.house_no} , {order.address.city}  ,{order.address.state} <br /> pin: {order.address.pin}</p>
                                                                            </>
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                order.status === "Completed" || order.status === "Rejected" ? order.status === "Completed" ?
                                                                                    <span className="badge bg-success">Completed</span>
                                                                                    :
                                                                                    <span className="badge bg-danger">Rejected</span>
                                                                                    :
                                                                                    <select
                                                                                        value={order.status}
                                                                                        onChange={(e) => updateOrderStatus(order._id, e.target.value as 'Pending' | 'Shipped' | 'Rejected' | 'Completed')}
                                                                                    >
                                                                                        <>
                                                                                            {
                                                                                                order.status === "Shipped" ?
                                                                                                    <>
                                                                                                        <option value="Shipped">Shipped</option>
                                                                                                        <option value="Completed">Completed</option>
                                                                                                        <option value="Rejected">Rejected</option>
                                                                                                    </>
                                                                                                    :
                                                                                                    <>
                                                                                                        <option value="Pending">Pending</option>
                                                                                                        <option value="Shipped">Shipped</option>
                                                                                                        <option value="Completed">Completed</option>
                                                                                                        <option value="Rejected">Rejected</option>
                                                                                                    </>
                                                                                            }
                                                                                        </>
                                                                                    </select>
                                                                            }
                                                                        </td>
                                                                        <td>{formattedDate}</td>
                                                                    </tr>
                                                                )
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
    )
}

export default Orders