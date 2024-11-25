export interface OrderRead{
    _id:string;
    total_price:number;
    status:string;
    createdAt: string;
    user_name:string;
    address:OrderAddress;
    products:OrderProducts[];
}
export interface OrderProducts{
    name:string;
    price:number;
    quantity:number;
    total_price:number;
}
export interface OrderAddress{
    pin:number;
    house_no:string;
    city:string;
    state:string;
}