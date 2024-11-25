import Sidebar from "../sidebar";
import Navbar from "../navbar";
import { useSelector } from "react-redux";
import { RootState } from "../../../state_management/store/store";
import axios from "axios";
import Modal from "../commonComponents/modal";
import { AddPin, PinData } from "./PinInterface";
import { useEffect, useRef, useState } from "react";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

const schema = yup.object().shape({
    pin: yup.string().min(6, "It should be a minimum of 6 digits").required("Pin is required"),
    price: yup.number().required("Price is required"),
});

const fileSchema = yup.object().shape({
    file: yup.mixed<FileList>().required('File is required')
});

interface AddFile {
    file: FileList;
}

const Pin = () => {
    const [showImportModal, setShowImportModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [EditPin, setEditPin] = useState<PinData>({ _id: "", pin: "", price: 0 });
    const [category, setCategory] = useState<PinData[]>([]);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const TOKEN = useSelector((state: RootState) => state.root.token);
    const AuthStr = 'Bearer '.concat(TOKEN);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<AddPin>({
        resolver: yupResolver(schema),
        defaultValues: {
            pin: "",
            price: 0,
        }
    });

    const { register: registerFile, handleSubmit: handleSubmitFile, formState: { errors: fileErrors } } = useForm<AddFile>({
        resolver: yupResolver(fileSchema),
    });

    const openImportModal = () => setShowImportModal(true);
    const closeImportModal = () => setShowImportModal(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => {
        setShowModal(false);
        reset({ pin: "", price: 0 });
    };

    const openEditModal = (id: string) => {
        setShowEditModal(true);
        const value = category.find((c) => c._id === id);
        if (value) {
            setEditPin(value);
            reset({ pin: value.pin, price: value.price });
        }
    };
    const closeEditModal = () => {
        setShowEditModal(false);
        reset({ pin: "", price: 0 });
    };

    const GetPinData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/pin/read', { headers: { Authorization: AuthStr } });
            setCategory(res.data.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const onSubmit = async (data: AddPin) => {
        try {
            const res = await axios.post("http://localhost:5000/pin/create", data, { headers: { Authorization: AuthStr } });
            if (res.data.success) {
                toast.success('Pin Added Successfully');
                reset();
                closeModal();
                GetPinData();
            } else {
                toast.error(res.data.message);
                reset();
                closeModal();
                GetPinData();
            }
        } catch (err) {
            console.log(err);
            toast.error('Pin Add Failed');
        }
    };

    const onUpdate = async (data: AddPin) => {
        try {
            const res = await axios.put(`http://localhost:5000/pin/update/${EditPin._id}`, data, { headers: { Authorization: AuthStr } });
            if (res.data.success==true) {
                toast.success('Pin Updated Successfully');
                closeEditModal();
                GetPinData();
            }else{
                toast.error(res.data.message);
                // closeEditModal();
                // GetPinData();
            }
        } catch (err) {
            console.log(err);
            toast.error('Pin Update Failed');
        }
    };

    const ImportHandler = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/pin/export-sample-excel`, {
                headers: { Authorization: AuthStr },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'AddPins.xlsx');
            document.body.appendChild(link);
            link.click();
            openImportModal()
        } catch (error) {
            console.log(error);
        }
    }

    const onSubmitFile = async (data: AddFile) => {
        const formData = new FormData();
        formData.append('file', data.file[0]);
        try {
            const res = await axios.post(`http://localhost:5000/pin/import-pin`, formData, {
                headers: {
                    Authorization: AuthStr,
                    'Content-Type': 'multipart/form-data'
                },
            });
            if (res.data.success) {
                toast.success('Pins Imported Successfully');
                closeImportModal();
                GetPinData();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        GetPinData();
    }, []);

    return (
        <div className="wrapper">
            <Sidebar isAuthenticated={true} sidebarRef={sidebarRef} />
            <div className="main">
                <Navbar sidebarRef={sidebarRef} />
                <main className="content">
                    <div className="container-fluid p-0">
                        <h1 className="h3 mb-3">Shipping Pin Page</h1>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title mb-0">Pin</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="col-12 col-md-6 col-xxl-3 d-flex order-1 order-xxl-1" style={{ width: "100%" }}>
                                            <div className="card flex-fill">
                                                <div className="card-header">
                                                    <div className="card-header" style={{ gap: "1rem", display: "flex" }}>
                                                        <button style={{
                                                            padding: "5px",
                                                            borderRadius: "5px",
                                                            border: "1px solid #000",
                                                            color: "#000",
                                                            backgroundColor: "#17a2b8",
                                                        }}
                                                            onClick={openModal}
                                                        >Add Pin</button>
                                                        <button style={{
                                                            padding: "5px",
                                                            borderRadius: "5px",
                                                            border: "1px solid #000",
                                                            color: "#000",
                                                            backgroundColor: "#17a2b8",
                                                        }}
                                                            onClick={ImportHandler}
                                                        >Import Pins</button>
                                                    </div>
                                                </div>
                                                <div className="table-responsive">
                                                    <table className="table table-hover my-0">
                                                        <thead>
                                                            <tr>
                                                                <th className="d-none d-xl-table-cell">Pin</th>
                                                                <th className="d-none d-xl-table-cell">Price</th>
                                                                <th className="d-none d-md-table-cell">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {category.map((cat) => (
                                                                <tr key={cat._id}>
                                                                    <td>{cat.pin}</td>
                                                                    <td>{cat.price}</td>
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
                    <h2>Add Pin</h2>
                    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '80%', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }} noValidate>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="pin" style={{ display: 'block', marginBottom: '5px' }}>Pin</label>
                            <input
                                {...register('pin')}
                                id="pin"
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                            {errors.pin && <p style={{ color: 'red', marginTop: '5px' }}>{errors.pin.message}</p>}
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="price" style={{ display: 'block', marginBottom: '5px' }}>Price</label>
                            <input
                                {...register('price')}
                                id="price"
                                type="number"
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                            {errors.price && <p style={{ color: 'red', marginTop: '5px' }}>{errors.price.message}</p>}
                        </div>
                        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#556cd6', color: '#fff', border: 'none', borderRadius: '5px' }}>Add</button>
                    </form>
                </Modal>
            </div>
            <div>
                <Modal show={showEditModal} onClose={closeEditModal}>
                    <h2>Edit Pin</h2>
                    <form onSubmit={handleSubmit(onUpdate)} style={{ width: '80%', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }} noValidate>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="pin" style={{ display: 'block', marginBottom: '5px' }}>Pin</label>
                            <input
                                {...register('pin')}
                                id="pin"
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                            {errors.pin && <p style={{ color: 'red', marginTop: '5px' }}>{errors.pin.message}</p>}
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="price" style={{ display: 'block', marginBottom: '5px' }}>Price</label>
                            <input
                                {...register('price')}
                                id="price"
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                            {errors.price && <p style={{ color: 'red', marginTop: '5px' }}>{errors.price.message}</p>}
                        </div>
                        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#556cd6', color: '#fff', border: 'none', borderRadius: '5px' }}>Update</button>
                    </form>
                </Modal>
            </div>
            <div>
                <Modal show={showImportModal} onClose={closeImportModal}>
                    <h2>Add CSV</h2>
                    <form onSubmit={handleSubmitFile(onSubmitFile)} style={{ width: '80%', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }} noValidate>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="file" style={{ display: 'block', marginBottom: '5px' }}>File</label>
                            <input
                                {...registerFile('file')}
                                type="file"
                                id="file"
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                            {fileErrors.file && <p style={{ color: 'red', marginTop: '5px' }}>{fileErrors.file.message}</p>}
                        </div>
                        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#556cd6', color: '#fff', border: 'none', borderRadius: '5px' }}>Submit</button>
                    </form>
                </Modal>
            </div>
        </div>
    );
}

export default Pin;
