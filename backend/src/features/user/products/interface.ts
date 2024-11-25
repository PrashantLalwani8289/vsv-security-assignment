export interface IAddCartData{
    product_id: string;
    user_id: string;
}
export interface IAddAddress{
    pin: number;
    state: string;
    city: string;
    house_no: string;
}
export interface IAddOrder{
    user_id: string;
    total_price: number;
    address_id: string;
}