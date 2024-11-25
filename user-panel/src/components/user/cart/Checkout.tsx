import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../state_management/store/store";
import { useEffect, useState } from "react";
import { AddAddressData, AddressDataWithPinPrice, GetAddressdData, GetCheckoutData, } from "./CartInterface";
import Modal from "../../commonComponents/modal";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import routes from "../../../routes/routes";

const schema = yup.object().shape({
    pin: yup.string().required("Pin is required").max(6,"Pin must be lesser than 5"),
    house_no: yup.string().required("House Number is required"),
    state: yup.string().required("State is required"),
    city: yup.string().required("City is required"),
});

const Checkout = () => {
    const navigate = useNavigate();
    const user_detail = useSelector((state: RootState) => state.root.user);
    const AuthStr = 'Bearer '.concat(user_detail?.token as string);
    const [checkoutData, setCheckoutData] = useState<GetCheckoutData[]>([]);
    const [addressData, setAddressData] = useState<AddressDataWithPinPrice>();
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [DeliveryPrice, setDeliveryPrice] = useState<0>(0);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const GetCheckout = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/get-order/${user_detail?.id}`, { headers: { Authorization: AuthStr } });
            setCheckoutData(res.data.data);
        } catch (error) {
            console.error("Error fetching checkout data", error);
        }
    };

    const GetAddress = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/get-address`, { headers: { Authorization: AuthStr } });
            setAddressData(res.data.data);
            setDeliveryPrice(res.data.data.pinPrice)
            const defaultAddress = res.data.data.addresses.find((address: GetAddressdData) => address.isDefault);
            if (defaultAddress) {
                setSelectedAddress(defaultAddress._id);
            }
        } catch (error) {
            console.error("Error fetching address data", error);
        }
    };

    useEffect(() => {
        GetCheckout();
        GetAddress();
    }, [user_detail]);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<AddAddressData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: AddAddressData) => {
        try {
            const res = await axios.post(`http://localhost:5000/add-address`, data, { headers: { Authorization: AuthStr } });
            if (res.data.success === true) {
                reset();
                closeModal();
                GetAddress();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const PlaceOrderHandler = async () => {
        if (!selectedAddress) {
            toast.error("Please select an address before placing the order");
            return;
        }
        try {
            const res = await axios.post(`http://localhost:5000/add-order`, {
                user_id: user_detail?.id,
                address_id: selectedAddress,
                total_price: checkoutData.reduce((acc, item) => acc + item.total_price, 0)
            }, { headers: { Authorization: AuthStr } });
            if (res.data.success === true) {
                toast.success('Your Order Has been Placed Successfully');
                navigate(routes.MYORDERS);
            }else{
                toast.error(res.data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const AddressChangeHandler = async (id: string) => {
        try {
            await axios.put(`http://localhost:5000/update-address-status/${id}`, {}, { headers: { Authorization: AuthStr } });
            setSelectedAddress(id);
            GetAddress();
        } catch (err) {
            console.error(err);
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    };

    return (
        <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ margin: "2rem", fontWeight: "bold" }}>Checkout</h1>
            <div style={{ width: '50%', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: "aliceblue", display: "grid", flexWrap: "wrap", gap: "2rem", marginTop: "2rem" }}>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <div className="cart-items">
                        {checkoutData.map(item => (
                            <div key={item._id} className="cart-item">
                                <img src={item.image} alt={item.name} />
                                <div className="cart-item-details">
                                    <h2>{item.name}</h2>
                                    <p>Total Price: ${item.total_price}</p>
                                    <p>Total Quantity: {item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-items">
                        <div style={{ display: "grid", justifyContent: "center" }}>
                            <button onClick={openModal} style={{ backgroundColor: "#77b9f2", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", cursor: "pointer" }}>Add Address</button>
                        </div>
                        {addressData?.addresses.map(address => (
                            <div key={address._id} className="cart-item">
                                <div className="cart-item-details" style={{ display: "flex", alignItems: "center" }}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "100%",
                                        cursor: "pointer"
                                    }} >
                                        <p>{`${address.house_no}, ${address.city}, ${address.state}, ${address.pin}`}</p>
                                    </div>
                                    <div >
                                        <input
                                            type="radio"
                                            name="address"
                                            value={address._id}
                                            checked={selectedAddress === address._id}
                                            onChange={() => AddressChangeHandler(address._id)}
                                            style={{ marginLeft: "25px" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ display: "grid", justifyContent: "center" }}>
                    <h4  style={{ color:"red"}}>delivery charge:₹{DeliveryPrice}</h4>
                    <h3>Total: ₹{checkoutData.reduce((acc, item) => acc + item.total_price+DeliveryPrice, 0)}</h3>
                    <button onClick={PlaceOrderHandler} style={{ backgroundColor: "green", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer" }}>Place Order</button>
                </div>
            </div>
            <div>
                <Modal show={showModal} onClose={closeModal}>
                    <h2>Add Address</h2>
                    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '80%', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }} noValidate>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="pin" style={{ display: 'block', marginBottom: '5px' }}>Pin</label>
                            <input
                                {...register('pin')}
                                id="pin"
                                type="text"
                                maxLength={6}
                                onInput={handleInput}
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                            {errors.pin && <p style={{ color: 'red', marginTop: '5px' }}>{errors.pin.message}</p>}
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="state" style={{ display: 'block', marginBottom: '5px' }}>State</label>
                            <input
                                {...register('state')}
                                id="state"
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                            {errors.state && <p style={{ color: 'red', marginTop: '5px' }}>{errors.state.message}</p>}
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="city" style={{ display: 'block', marginBottom: '5px' }}>City</label>
                            <input
                                {...register('city')}
                                id="city"
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                            {errors.city && <p style={{ color: 'red', marginTop: '5px' }}>{errors.city.message}</p>}
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="house_no" style={{ display: 'block', marginBottom: '5px' }}>House Number</label>
                            <input
                                type="text"
                                {...register('house_no')}
                                id="house_no"
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                            {errors.house_no && <p style={{ color: 'red', marginTop: '5px' }}>{errors.house_no.message}</p>}
                        </div>
                        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#556cd6', color: '#fff', border: 'none', borderRadius: '5px' }}>Add Address</button>
                    </form>
                </Modal>
            </div>
        </div>
    );
};

export default Checkout;
