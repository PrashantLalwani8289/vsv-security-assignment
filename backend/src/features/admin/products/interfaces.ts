export interface IProductsAdd{
    name: string;
    price: number;
    quantity: number;
    category_id: string;
    description: string;
    image: string;
    createdAt: Date;
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