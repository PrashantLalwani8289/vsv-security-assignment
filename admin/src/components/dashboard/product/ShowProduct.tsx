import Sidebar from "../sidebar";
import Navbar from "../navbar";
import { useNavigate } from "react-router-dom";
import routes from "../../../routes/routes";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { GetProduct } from "./productInterface";
import { useSelector } from "react-redux";
import { RootState } from "../../../state_management/store/store";
import Modal from "../commonComponents/modal";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import Loader from "../commonComponents/Loader";

const schema = yup.object().shape({
    file: yup.mixed<FileList>().required('File is required')
});
export interface AddFile {
    file: FileList;
}
const ShowProduct = () => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const TOKEN = useSelector((state: RootState) => state.root.token);
    const AuthStr = 'Bearer '.concat(TOKEN);
    const navigate = useNavigate();
    const [products, setProducts] = useState<GetProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const GetProducts = () => {
        setLoading(true);
        try {
            axios.get('http://localhost:5000/product/read', { headers: { Authorization: AuthStr } })
                .then(res => setProducts(res.data.data))

        } finally {
            setLoading(false);
        }
    }
    const StatusHandler = async (id: string) => {
        const isConfirm = confirm('Are you Sure You Want To Change status')
        if (isConfirm) {
            await axios.post(`http://localhost:5000/product/update-status`, { id: id }, { headers: { Authorization: AuthStr } })
            GetProducts()
        }
    }
    const ExportProductHandler = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/product/export-products`, {
                headers: { Authorization: AuthStr },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'products.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.log(err);
        }
    }
    const ImportHandler = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/product/export-sample-excel`, {
                headers: { Authorization: AuthStr },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Addproducts.xlsx');
            document.body.appendChild(link);
            link.click();
            openModal()
        } catch (error) {
            console.log(error);
        }
    }
    const onSubmit = async (data: AddFile) => {
        const formData = new FormData();
        formData.append('file', data.file[0]);
        try {
            await axios.post(`http://localhost:5000/product/import-products`, formData, {
                headers: {
                    Authorization: AuthStr,
                    'Content-Type': 'multipart/form-data'
                },
            }).then(res => {
                if (res.data.success === true) {
                    toast.success('Products Imported Successfully')
                    closeModal()
                    GetProducts()
                } else {
                    toast.error(res.data.message)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        GetProducts()
    }, [])
    return (
        <div className="wrapper">
            <Sidebar isAuthenticated={true} sidebarRef={sidebarRef} />
            <div className="main">
                <Navbar sidebarRef={sidebarRef}/>
                <main className="content">
                    <div className="container-fluid p-0">
                        <h1 className="h3 mb-3">Product  Page</h1>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title mb-0">Product View</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="col-12 col-md-6 col-xxl-3 d-flex order-1 order-xxl-1" style={{ width: "100%" }}>
                                            <div className="card flex-fill" >
                                                <div className="card-header" style={{ gap: "1rem", display: "flex" }}>
                                                    <button style={{
                                                        padding: "5px",
                                                        borderRadius: "5px",
                                                        border: "1px solid #000",
                                                        color: "#000",
                                                        backgroundColor: "#17a2b8",
                                                    }}
                                                        onClick={() => { navigate(routes.PRODUCTS_ADD) }}
                                                    >Add Product</button>
                                                    <button style={{
                                                        padding: "5px",
                                                        borderRadius: "5px",
                                                        border: "1px solid #000",
                                                        color: "#000",
                                                        backgroundColor: "#17a2b8",
                                                    }}
                                                        onClick={ExportProductHandler}
                                                    >Export Products</button>
                                                    <button style={{
                                                        padding: "5px",
                                                        borderRadius: "5px",
                                                        border: "1px solid #000",
                                                        color: "#000",
                                                        backgroundColor: "#17a2b8",
                                                    }}
                                                        onClick={ImportHandler}
                                                    >Import Products</button>
                                                </div>
                                                <div className="table-responsive">
                                                    <table className="table table-hover my-0">
                                                        <thead>
                                                            <tr>
                                                                <th className="d-none d-xl-table-cell">Name</th>
                                                                <th className="d-none d-xl-table-cell">Category</th>
                                                                <th className="d-none d-xl-table-cell">Price</th>
                                                                <th className="d-none d-xl-table-cell">Quantity</th>
                                                                <th className="d-none d-xl-table-cell">Image</th>
                                                                <th className="d-none d-xl-table-cell">Status</th>
                                                                <th className="d-none d-md-table-cell">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {loading ? (
                                                                <tr>
                                                                    <td  style={{ textAlign: 'center' }}>
                                                                        <Loader />
                                                                    </td>
                                                                </tr>)
                                                                : (
                                                                    products.map((product) => (
                                                                        <tr key={product._id}>
                                                                            <td>{product.name}</td>
                                                                            <td>{product.category}</td>
                                                                            <td>{product.price}</td>
                                                                            <td>{product.quantity}</td>
                                                                            <td><img src={product.image} alt={product.name} style={{ width: "100px" }} /></td>
                                                                            <td>{
                                                                                product.status === "active" ?
                                                                                    <span className="badge bg-success" onClick={() => { StatusHandler(product._id) }} style={{ cursor: "pointer" }}>Active</span>
                                                                                    :
                                                                                    <span className="badge bg-danger" onClick={() => { StatusHandler(product._id) }} style={{ cursor: "pointer" }}>Inactive</span>
                                                                            }
                                                                            </td>
                                                                            <td>
                                                                                <button style={{
                                                                                    padding: "5px",
                                                                                    borderRadius: "5px",
                                                                                    border: "1px solid #000",
                                                                                    color: "#000",
                                                                                    backgroundColor: "green",
                                                                                }}
                                                                                    onClick={() => navigate(routes.PRODUCTS_EDIT, { state: { id: product._id } })}
                                                                                >Edit</button>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                )}
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
                    <Modal show={showModal} onClose={closeModal}>
                        <h2>Add Csv</h2>
                        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '80%', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }} noValidate>
                            <div style={{ marginBottom: '15px' }}>
                                <label htmlFor="state" style={{ display: 'block', marginBottom: '5px' }}>File</label>
                                <input
                                    type="file"
                                    {...register('file')}
                                    id="file"
                                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                                />
                                {errors.file && <p style={{ color: 'red', marginTop: '5px' }}>{errors.file.message}</p>}
                            </div>
                            <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#556cd6', color: '#fff', border: 'none', borderRadius: '5px' }}>Submit</button>
                        </form>
                    </Modal>
                </main>
            </div>
        </div>
    )
}

export default ShowProduct