import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { CartItemData, CategoriesData, ProductsData } from "./Profile/ProfileInterface";
import { useSelector } from "react-redux";
import { RootState } from "../../state_management/store/store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import routes from "../../routes/routes";
import Loader from "../commonComponents/Loader";
const Home = () => {
    const navigate = useNavigate();
    const [productData, setProductData] = useState<ProductsData[]>([]);
    const [categoryData, setCategoryData] = useState<CategoriesData[]>([]);
    const [limit, setLimit] = useState(4);
    const [searchData, setSearchData] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [noMoreProducts, setNoMoreProducts] = useState(false);
    const [CartItem, setCartItem] = useState<CartItemData[]>([]);
    const [loading, setLoading] = useState(true);
    const [PinValue, setPinValue] = useState('');
    const isAuthenticated = useSelector((state: RootState) => state.root.isAuthenticated);
    const user_detail = useSelector((state: RootState) => state.root.user);
    const AuthStr = 'Bearer '.concat(user_detail?.token as string);

    const GetProducts = async (newLimit: number = limit) => {
        setLoading(true);  // Set loading to true before fetching data
        try {
            const res = await axios.get(`http://localhost:5000/get-product`, {
                params: {
                    page: 1,
                    limit: newLimit,
                    search: searchData,
                    category: selectedCategory,
                    sort: sortOrder
                }
            });
            if (res.data.data.length < newLimit) {
                setNoMoreProducts(true);
            } else {
                setNoMoreProducts(false);
            }
            setProductData(res.data.data);
        } finally {
            setLoading(false);  // Set loading to false after data is fetched
        }
    };

    const GetCategory = async () => {
        const res = await axios.get(`http://localhost:5000/get-category`);
        setCategoryData(res.data.data);
    };

    const addToCartHandler = (id: string) => async () => {
        if (isAuthenticated) {
            const AddCartData = {
                user_id: user_detail?.id,
                product_id: id
            };
            await axios.post('http://localhost:5000/addCart', AddCartData, { headers: { Authorization: AuthStr } });
            toast.success('🦄 The Product Has Been Added Into The Cart');
            GetCartItem();
        } else {
            navigate(routes.LOGIN);
        }
    };

    const LoadMoreHandler = async () => {
        const newLimit = limit + 4;
        setLimit(newLimit);
        const res = await axios.get(`http://localhost:5000/get-product`, {
            params: {
                page: 1,
                limit: newLimit,
                search: searchData,
                category: selectedCategory,
                sort: sortOrder
            }
        });
        if (res.data.data.length <= productData.length) {
            setNoMoreProducts(true);
        } else {
            setProductData(res.data.data);
        }
    };

    const GetCartItem = async () => {
        await axios.get(`http://localhost:5000/get-product-cart`, { headers: { Authorization: AuthStr } }).then(res => {
            setCartItem(res.data.data);
        })
    }

    const PincheckHandler = () => {
        if(PinValue.length ===0){
            toast.error('Please Enter Pin');
            return;
        }
        axios.post('http://localhost:5000/check-pin', { pin: PinValue }, { headers: { Authorization: AuthStr } })
            .then(res => { if(res.data.success==true){
                toast.success('Pin Matched Successfully');
            }else{
                toast.error('Pin Not Matched');
            }})
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            GetProducts();
            GetCategory();
            GetCartItem();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [limit, searchData, selectedCategory, sortOrder]);

    useEffect(() => {
    }, [CartItem]);
    return (
        <>
            <div>
                <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>
                    <h1 style={{ margin: "2rem", fontWeight: "bold" }}>Shopping Hub</h1>
                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '80%',
                        padding: '20px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: 'aliceblue', marginTop: '2rem'
                    }}>
                        <div style={{
                            fontSize: '1.5rem', fontWeight: 'bold',
                            textAlign: 'center', marginBottom: '1rem'
                        }}>Filters</div>
                        <div style={{
                            display: 'flex', flexWrap: 'wrap',
                            gap: '1rem', justifyContent: 'center'
                        }}>
                            <input
                                type="text"
                                placeholder="Search products"
                                style={{
                                    padding: '10px', border: '1px solid #ccc',
                                    borderRadius: '5px', width: '200px', boxSizing: 'border-box'
                                }}
                                onChange={(e) => setSearchData(e.target.value)}
                            />
                            <select
                                name="category"
                                id="category"
                                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', width: '200px', boxSizing: 'border-box' }}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">All</option>
                                {categoryData.map((category) => (
                                    <option key={category._id} value={category._id}>{category.name}</option>
                                ))}
                            </select>
                            <select
                                name="sort"
                                id="sort"
                                style={{
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    width: '200px',
                                    boxSizing: 'border-box'
                                }}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="">Sort By</option>
                                <option value="LowToHigh">Price: Low to High</option>
                                <option value="HighToLow">Price: High to Low</option>
                            </select>
                            <div>
                                <input type="text"
                                    placeholder="Check Pin"
                                    style={{
                                        padding: '10px', border: '1px solid #ccc',
                                        borderRadius: '5px', width: '200px', boxSizing: 'border-box'
                                    }}
                                    onChange={(e) => { setPinValue(e.target.value) }}
                                />
                                <span style={{
                                    padding: "10px",
                                    border: '1px solid #ccc',
                                    marginLeft: "10px",
                                    cursor: "pointer"
                                }}
                                    onClick={ PincheckHandler }
                                >
                                    <FaSearch />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '80%', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: "aliceblue", display: "flex", flexWrap: "wrap", gap: "4rem", marginTop: "2rem", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
                        {
                            loading ? (
                                <Loader />
                            ) :
                                productData.length > 0 ? (
                                    productData.map((product) => (
                                        <div className="product-card" key={product._id}>
                                            <img src={product.image} alt="" className="product-card__image" />
                                            <h2 className="product-card__name">{product.name}</h2>
                                            <p className="product-card__price">₹{product.price.toFixed(2)}</p>
                                            <p className="product-card__description">{product.description}</p>
                                            {
                                                isAuthenticated ?
                                                    product.quantity <= 0 ?
                                                        <button className="product-card__button" style={{ backgroundColor: "red" }} disabled>Out of Stock</button>
                                                        :
                                                        CartItem.find((item) => item.product_id === product._id) ?
                                                            <button className="product-card__button" style={{ backgroundColor: "green" }} onClick={() => navigate(routes.CART)}>View Cart</button>
                                                            :
                                                            <button className="product-card__button" onClick={addToCartHandler(product._id.toString())}>Add to Cart</button>
                                                    :
                                                    <button className="product-card__button" onClick={() => { navigate(routes.LOGIN) }}>Please Login</button>
                                            }
                                        </div>
                                    ))
                                ) : (
                                    <p>No products found</p>
                                )
                        }
                    </div>
                    {
                        productData.length > 0 && !noMoreProducts && (
                            <button onClick={LoadMoreHandler} style={{
                                marginTop: "20px",
                                padding: "10px 20px",
                                borderRadius: "5px",
                                border: "none",
                                backgroundColor: "#007bff",
                                color: "#fff",
                                cursor: "pointer"
                            }}>Load More</button>
                        )
                    }
                </div>
            </div>
        </>
    );
}

export default Home;
