import axios from "axios"
import { useSelector } from "react-redux";
import { RootState } from "../../../state_management/store/store";
import { useEffect, useState } from "react";
import { GetOrderData } from "./CartInterface";

const MyOrder = () => {
    const user_detail = useSelector((state: RootState) => state.root.user);
    const AuthStr = 'Bearer '.concat(user_detail?.token as string);
    const [OrderData, setOrderData] = useState<GetOrderData[]>([]);
    const GetMyOrder = async () => {
        await axios.get(`http://localhost:5000/get-all-order`, { headers: { Authorization: AuthStr } })
            .then(res => { setOrderData(res.data.data);})
    }
    useEffect(() => {
        GetMyOrder()

    }, [])
    return (
        <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ margin: "2rem", fontWeight: "bold" }}>MyOrders</h1>
            <div style={{ width: '80%', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: "aliceblue", display: "flex", flexWrap: "wrap", gap: "2rem", marginTop: "2rem" }}>
                {OrderData.length === 0 ? (
                    <p style={{ textAlign: 'center' }}>You have no orders.</p>
                ) : (
                    OrderData.map(order => (
                        <div key={order._id} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '15px', marginBottom: '15px' ,backgroundColor:"white"}}>
                            <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px' }}>Order #{order._id}</h2>
                            {order.products.map(item => (
                                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 5px 0' }}>{item.name}</h3>
                                        <p style={{ margin: '0' }}>Price: ₹{item.price.toFixed(2)}</p>
                                        <p style={{ margin: '0' }}>Quantity: {item.quantity}</p>
                                    </div>
                                    <div>
                                        <p style={{ margin: '0', fontWeight: 'bold' }}>Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                            <p style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '10px' }}>
                                Order Total: ₹{order.total_price}
                            </p>
                            <p style={{ textAlign: 'left', fontWeight: 'bold', marginTop: '10px' }}>
                                Shipping Address: <br />
                                {order.address.house_no},
                                {order.address.city} ,
                                {order.address.state},
                                {order.address.pin}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default MyOrder