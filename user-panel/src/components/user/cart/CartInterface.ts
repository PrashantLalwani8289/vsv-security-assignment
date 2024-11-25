export interface ICartData{
    _id: string;
    product_id: string;
    quantity: number;
    price: number;
    total_price: number;
    total: number;
    image: string;
    name: string;
}
export interface GetCheckoutData{
    _id: string;
    name:string;
    image:string;
    total_price:number;
    quantity: number;
}
export interface AddAddressData{
    pin:string;
    state:string;
    city:string;
    house_no:string
}
export interface GetOrderData{
    _id: string;
    products:ProductArrayOfOrder[];
    address: AddressArrayOfOrder;
    total_price: number;
    status: string;
    createdAt: string;
}
export interface ProductArrayOfOrder{
    _id: string;
    quantity: number;
    price: number;
    name: string;
    image: string;
}
export interface AddressArrayOfOrder{
    city: string;
    state: string;
    house_no: string;
    pin: number;
}
export interface AddressDataWithPinPrice{
    addresses:GetAddressdData[];
    pinPrice: number;
}
// export interface PinsPrice{
//     price:number;
// }
export interface GetAddressdData{
    _id: string;
    pin: number;
    state: string;
    city: string;
    house_no: string;
    user_id: string;
    isDefault: boolean;
}