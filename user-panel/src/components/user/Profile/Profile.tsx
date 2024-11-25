import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Modal from "../../commonComponents/modal";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { ProfileData } from "./ProfileInterface";
import { RootState } from "../../../state_management/store/store";

const schema = yup.object().shape({
    username: yup.string().required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    gender: yup.string().required("Gender is required"),
    dob: yup.string().required("Date of birth is required")
});

const Profile = () => {
    const today = new Date();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileData>({
        resolver: yupResolver(schema),
        defaultValues: {
            username: "",
            email: "",
            gender: "",
            dob: ""
        }
    });

    const onSubmit = async (data: ProfileData) => {
        try {
            console.log(data);
            const AuthStr = 'Bearer '.concat(user?.token as string);
            const res = await axios.put(`http://localhost:5000/update-profile/${user?.id}`, data, { headers: { Authorization: AuthStr } });

            if (res.data.success === true) {
                toast.success('Profile Updated Successfully', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                reset();
                closeModal();
                fetchProfileData()
            }
        } catch (err) {
            console.log(err);
            toast.error('Profile Update Failed', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const user = useSelector((state: RootState) => state.root.user);
    const [profileData, setProfileData] = useState<ProfileData>({
        username: "",
        email: "",
        dob: "",
        gender: "",
    });
    const fetchProfileData = async () => {
        try {
            const AuthStr = 'Bearer '.concat(user?.token as string);
            const res = await axios.get(`http://localhost:5000/get-profile/${user?.id}`, { headers: { Authorization: AuthStr } });
            const data = res.data.data;
            setProfileData(data);
            reset(data);
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        fetchProfileData();
    }, [user?.token]);
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ width: '500px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: "aliceblue" }}>
                <div style={{ marginBottom: '15px', display: "grid" }}>
                    <img src="https://i.pravatar.cc/300" alt="Profile" height={"100px"} width={"100px"} style={{ borderRadius: "50%", border: "2px solid black" }} />
                </div>
                <div style={{ marginBottom: '15px', display: "flex" }}>
                    <h3>UserName:- </h3>
                    <h4 >{profileData.username}</h4>
                </div>
                <div style={{ marginBottom: '15px', display: "flex" }}>
                    <h3>Email:-</h3>
                    <h4 >{profileData.email}</h4>
                </div>
                <div style={{ marginBottom: '15px', display: "flex" }}>
                    <h3>Gender:-</h3>
                    <h4 >{profileData.gender}</h4>
                </div>
                <div style={{ marginBottom: '15px', display: "flex" }}>
                    <h3>DOB:-</h3>
                    <h4 >{profileData.dob}</h4>
                </div>
                <div>
                    <button style={{ color: "black", backgroundColor: "yellow", padding: "15px" }} onClick={openModal} > Edit</button>
                </div>
            </div>
            <div>
                <Modal show={showModal} onClose={closeModal}>
                    <h2>Edit Profile</h2>
                    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '80%', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }} noValidate>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Username</label>
                            <input
                                {...register('username')}
                                id="username"
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                            {errors.username && <p style={{ color: 'red', marginTop: '5px' }}>{errors.username.message}</p>}
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                            <input
                                {...register('email')}
                                id="email"
                                readOnly
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                            {errors.email && <p style={{ color: 'red', marginTop: '5px' }}>{errors.email.message}</p>}
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="gender" style={{ display: 'block', marginBottom: '5px' }}>Gender</label>
                            <select
                                {...register('gender')}
                                id="gender"
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            {errors.gender && <p style={{ color: 'red', marginTop: '5px' }}>{errors.gender.message}</p>}
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="dob" style={{ display: 'block', marginBottom: '5px' }}>Date of Birth</label>
                            <input
                                type="date"
                                {...register('dob')}
                                id="dob"
                                max={today.toISOString().split('T')[0]}
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                            {errors.dob && <p style={{ color: 'red', marginTop: '5px' }}>{errors.dob.message}</p>}
                        </div>
                        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#556cd6', color: '#fff', border: 'none', borderRadius: '5px' }}>Update</button>
                    </form>
                </Modal>
            </div>
        </div>
    );
}

export default Profile;
