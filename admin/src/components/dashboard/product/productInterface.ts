export interface AddProduct{
    name: string;
    price: string;
    quantity: number;
    
    category_id: string;
    description: string;
    image: FileList;
}
export interface EditProduct{
    name: string;
    price: string;
    quantity: number;
    category_id: string;
    description: string;
    image: FileList|null|string;
}
export interface GetProduct{
    _id: string;
    name: string;
    price: string;
    quantity: number;
    category: string;
    status: string;
    description: string;
    image: string;
}