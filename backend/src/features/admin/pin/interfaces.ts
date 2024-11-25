export interface IPinAdd{
    pin: number;
    price: number;
}
export interface IUpdateStatus{
    status:"Completed"|"Pending" |"Rejected"|"Shipped"
}
export interface ProductData {
    name: string;
    price: number;
    quantity: number;
    category: string;
    description: string;
}