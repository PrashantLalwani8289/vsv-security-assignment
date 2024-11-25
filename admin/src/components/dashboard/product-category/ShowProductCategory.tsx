import Sidebar from "../sidebar";
import Navbar from "../navbar";
import { useSelector } from "react-redux";
import { RootState } from "../../../state_management/store/store";
import axios from "axios";
import Modal from "../commonComponents/modal";
import { AddCategory, CategoryName } from "./ProductCategoryInterface";
import { useEffect, useRef, useState } from "react";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

const schema = yup.object().shape({
    name: yup.string().required("name is required")
});

const ShowProductCategory = () => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<AddCategory>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
        }
    });
    const TOKEN = useSelector((state: RootState) => state.root.token);
    const AuthStr = 'Bearer '.concat(TOKEN);

    // add modal
    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => {
        setShowModal(false);
        reset({ name: "" });
    };

    // edit modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [EditCategory, setEditCategory] = useState<CategoryName>({ _id: "", name: "" });
    const openEditModal = (id: string) => {
        setShowEditModal(true);
        const value = category.find((c) => c._id === id);
        if (value) {
            setEditCategory(value);
            reset({ name: value.name }); // Set initial values for the edit form
        }
    };
    const closeEditModal = () => {
        setShowEditModal(false);
        reset({ name: "" });
    };

    const [category, setCategory] = useState<CategoryName[]>([]); // Define state with Category type
    const GetCategoryData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/product-category/read', { headers: { Authorization: AuthStr } });
            setCategory(res.data.data); // Set fetched category data to state
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const onSubmit = async (data: AddCategory) => {
        try {
            const res = await axios.post("http://localhost:5000/product-category/create", data, { headers: { Authorization: AuthStr } });
            if (res.data.success === true) {
                toast.success('Category Added Successfully');
                reset();
                closeModal();
                GetCategoryData();
            }
        } catch (err) {
            console.log(err);
            toast.error('Category Add Failed');
        }
    };

    const onUpdate = async (data: AddCategory) => {
        try {
            const res = await axios.put(`http://localhost:5000/product-category/update/${EditCategory._id}`, data, { headers: { Authorization: AuthStr } });
            if (res.data.success === true) {
                toast.success('Category Updated Successfully');
                closeEditModal();
                GetCategoryData();
            }
        } catch (err) {
            console.log(err);
            toast.error('Category Update Failed');
        }
    };

    useEffect(() => {
        GetCategoryData();
    }, []);

    return (
        <div className="wrapper">
            <Sidebar isAuthenticated={true} sidebarRef={sidebarRef}/>
            <div className="main">
                <Navbar sidebarRef={sidebarRef}/>
                <main className="content">
                    <div className="container-fluid p-0">
                        <h1 className="h3 mb-3">Product Category Page</h1>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title mb-0">Category View</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="col-12 col-md-6 col-xxl-3 d-flex order-1 order-xxl-1" style={{ width: "100%" }}>
                                            <div className="card flex-fill">
                                                <div className="card-header">
                                                    <button style={{
                                                        padding: "5px",
                                                        borderRadius: "5px",
                                                        border: "1px solid #000",
                                                        color: "#000",
                                                        backgroundColor: "#17a2b8",
                                                    }}
                                                        onClick={openModal}
                                                    >Add Category</button>
                                                </div>
                                                <div className="table-responsive">
                                                    <table className="table table-hover my-0">
                                                        <thead>
                                                            <tr>
                                                                <th className="d-none d-xl-table-cell">Name</th>
                                                                <th className="d-none d-md-table-cell">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {category.map((cat) => (
                                                                <tr key={cat._id}>
                                                                    <td>{cat.name}</td>
                                                                    <td>
                                                                        <button className="btn btn-sm btn-primary" onClick={() => openEditModal(cat._id as string)}>Edit</button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <div>
                <Modal show={showModal} onClose={closeModal}>
                    <h2>Add Category</h2>
                    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '80%', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }} noValidate>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>name</label>
                            <input
                                {...register('name')}
                                id="name"
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                            {errors.name && <p style={{ color: 'red', marginTop: '5px' }}>{errors.name.message}</p>}
                        </div>
                        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#556cd6', color: '#fff', border: 'none', borderRadius: '5px' }}>Add</button>
                    </form>
                </Modal>
            </div>
            <div>
                <Modal show={showEditModal} onClose={closeEditModal}>
                    <h2>Edit Category</h2>
                    <form onSubmit={handleSubmit(onUpdate)} style={{ width: '80%', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }} noValidate>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>name</label>
                            <input
                                {...register('name')}
                                id="name"
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                            {errors.name && <p style={{ color: 'red', marginTop: '5px' }}>{errors.name.message}</p>}
                        </div>
                        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#556cd6', color: '#fff', border: 'none', borderRadius: '5px' }}>Update</button>
                    </form>
                </Modal>
            </div>
        </div>
    )
}

export default ShowProductCategory;
