import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../state_management/store/store";
import { useEffect, useState } from "react";
import { ICartData } from "./CartInterface";
import routes from "../../../routes/routes";
import { CartItemData } from "../Profile/ProfileInterface";

const Cart = () => {
    const navigate = useNavigate();
    const user_detail = useSelector((state: RootState) => state.root.user);
    const AuthStr = 'Bearer '.concat(user_detail?.token as string);
    const [CartData, setCartData] = useState<ICartData[]>([]);
    const [CartItem, setCartItem] = useState<CartItemData[]>([]);

    const GetCartItem = async () => {
        await axios.get(`http://localhost:5000/GetCart/${user_detail?.id}`, { headers: { Authorization: AuthStr } })
            .then(res => setCartData(res.data.data));
    };
    const GetCartQuantity = async () => {
        await axios.get(`http://localhost:5000/get-product-cart`, { headers: { Authorization: AuthStr } }).then(res => {
            setCartItem(res.data.data);
        })
    }

    const updateCartQuantity = async (cartId: string, quantity: number) => {
        if (quantity < 1) {
            ItemRemoveHandler(cartId)
            return;
        };
        await axios.put(`http://localhost:5000/update-cart/${cartId}`, { quantity }, { headers: { Authorization: AuthStr } })
            .then(res => {
                if (res.data.success) {
                    setCartData(prevCartData =>
                        prevCartData.map(item =>
                            item._id === cartId ? { ...item, quantity, total_price: res.data.data.total_price } : item
                        )
                    );
                }
            });
    };

    useEffect(() => {
        GetCartItem();
        GetCartQuantity();

    }, []);

    const ItemRemoveHandler = async (id: string) => {
        const check = confirm('Are you sure you want to remove this item from the cart?');
        if (check) {
            await axios.delete(`http://localhost:5000/delete-cart-item/${id}`, { headers: { Authorization: AuthStr } })
            GetCartItem();
        }
    };
    const ClearCartHandler=async()=>{
        const check = confirm('Are you sure you want to clear the cart?');
        if (check) {
            await axios.delete(`http://localhost:5000/empty-cart/${user_detail?.id}`, { headers: { Authorization: AuthStr } })
            GetCartItem();
        }
    }
    let TotalValue = CartData.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ margin: "2rem", fontWeight: "bold" }}>MyCart</h1>
            <div style={{ width: '80%', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: "aliceblue", display: "flex", flexWrap: "wrap", gap: "2rem", marginTop: "2rem" }}>
                <div className="cart-page">
                    {Object.keys(CartData).length === 0 ? (
                        <div>
                            <p>Your cart is empty</p>
                            <button onClick={() => navigate(routes.HOME)} style={{ backgroundColor: "green", padding: "4px" }}>Continue Shopping</button>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items">
                                {CartData.map(item => (
                                    <div key={item._id} className="cart-item">
                                        <img src={item.image} alt={item.name} />
                                        <div className="cart-item-details">
                                            <h2>{item.name}</h2>
                                            <p>₹{item.total_price}</p>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <button onClick={() => updateCartQuantity(item._id, item.quantity - 1)} style={{ padding: "5px", margin: "3px", backgroundColor: "blue" }}>-</button>
                                                <p>{item.quantity}</p>
                                                {
                                                    CartItem.find((value) => value._id === item._id) ?
                                                        CartItem.find((quant) => quant.product_quantity <= item.quantity) ?
                                                            <p style={{ color: "red", margin: "3px", }}> Out Of Stock</p>
                                                            :
                                                            <button onClick={() => updateCartQuantity(item._id, item.quantity + 1)} style={{ padding: "5px", margin: "3px", backgroundColor: "blue" }}>+</button>
                                                        :
                                                        <button onClick={() => updateCartQuantity(item._id, item.quantity + 1)} style={{ padding: "5px", margin: "3px", backgroundColor: "blue" }}>+</button>
                                                }
                                            </div>
                                            <button onClick={() => ItemRemoveHandler(item._id.toString())}>Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="cart-summary">
                                <h2>Total: ₹{TotalValue.toFixed(2)}</h2>
                                <button onClick={() => { navigate(routes.CHECKOUT) }} style={{ backgroundColor: "green", margin: "2rem" }}>Proceed To Checkout</button>
                                <button onClick={() => ClearCartHandler() }>Clear Cart</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
