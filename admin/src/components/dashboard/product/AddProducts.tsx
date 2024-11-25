import Sidebar from "../sidebar";
import Navbar from "../navbar";
import { useNavigate } from "react-router-dom";
import routes from "../../../routes/routes";
import { useSelector } from "react-redux";
import { RootState } from "../../../state_management/store/store";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { AddProduct } from "./productInterface";
import { useEffect, useRef, useState } from "react";
import { CategoryName } from "../product-category/ProductCategoryInterface";
import axios from "axios";
import { toast } from "react-toastify";
const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    category_id: yup.string().required('Category is required'),
    price: yup.string().required('Price is required'),
    quantity: yup.number().required('Quantity is required'),
    description: yup.string().required('Description is required'),
    image: yup.mixed<FileList>().required('Image is required')
});
const AddProducts = () => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const TOKEN = useSelector((state: RootState) => state.root.token);
    const AuthStr = 'Bearer '.concat(TOKEN);
    const convertToBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const [category, setCategory] = useState<CategoryName[]>([]);
    const GetCategory = async () => {
        try {
            const res = await axios.get('http://localhost:5000/product-category/read', { headers: { Authorization: AuthStr } });
            setCategory(res.data.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    }
    useEffect(() => {
        GetCategory();
    }, []);
    const onSubmit = async (data: AddProduct) => {
        const profileImageFile = data.image[0];
        let profileImageBase64 = null;

        if (profileImageFile) {
            profileImageBase64 = await convertToBase64(profileImageFile);
        }

        const formData = {
            ...data,
            image: profileImageBase64,
        };
        const res=await axios.post('http://localhost:5000/product/create', formData, { headers: { Authorization: AuthStr } });
        if(res.data.success===true) {
            navigate(routes.PRODUCTS);
            toast.success('Product Added Successfully');
        }else{
            toast.error('Failed to Add Product');
        }
    }
    return (
        <div className="wrapper">
            <Sidebar isAuthenticated={true}  sidebarRef={sidebarRef}/>
            <div className="main">
                <Navbar sidebarRef={sidebarRef}/>
                <main className="content">
                    <div className="container-fluid p-0">
                        <h1 className="h3 mb-3">Add Product Page</h1>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <button style={{
                                            padding: "5px",
                                            borderRadius: "5px",
                                            border: "1px solid #000",
                                            color: "#000",
                                            backgroundColor: "red",
                                        }}
                                            onClick={() => { navigate(routes.PRODUCTS) }}
                                        >Back</button>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className="form-group">
                                                <label htmlFor="name">Name</label>
                                                <input type="text" id="name" className="form-control" {...register('name')} />
                                                {errors.name && <p className="text-danger">{errors.name.message}</p>}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="price">Price</label>
                                                <input type="text" id="price" className="form-control" {...register('price')} />
                                                {errors.price && <p className="text-danger">{errors.price.message}</p>}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="quantity">Quantity</label>
                                                <input type="number" id="quantity" className="form-control" {...register('quantity')} />
                                                {errors.quantity && <p className="text-danger">{errors.quantity.message}</p>}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="description">Description</label>
                                                <input type="text" id="description" className="form-control" {...register('description')} />
                                                {errors.description && <p className="text-danger">{errors.description.message}</p>}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="category">Category</label>
                                                <select id="category" className="form-control" {...register('category_id')}>
                                                    <option value="">Select Category</option>
                                                    {category.map((cat: CategoryName) => (
                                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                                {errors.category_id && <p className="text-danger">{errors.category_id.message}</p>}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="image">Image</label>
                                                <input type="file" id="image" className="form-control" {...register('image')} />
                                                {errors.image && <p className="text-danger">{errors.image.message}</p>}
                                            </div>
                                            <button type="submit" className="btn btn-primary mt-3">Submit</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AddProducts