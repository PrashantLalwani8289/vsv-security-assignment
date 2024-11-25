export interface ProfileData {
    username: string;
    email: string;
    dob: string;
    gender: string;
  }
  export interface ProductsData{
    _id:string;
    name: string;
    price: number;
    category: string;
    quantity: number;
    image: string;
    description: string;
    
  }
  export interface CategoriesData{
    _id:string;
    name: string;
  }
  export interface CartItemData{
    _id: string;
    product_id: string;
    quantity: number;
    total_price: number;
    product_quantity: number;
  }