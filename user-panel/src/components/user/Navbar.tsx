import { Link } from "react-router-dom"
import routes from "../../routes/routes"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state_management/store/store";
import { logout } from "../../state_management/actions/rootReducer";

const Navbar = () => {
    const dispatch=useDispatch()
    const isAuthenticated = useSelector((state: RootState) => state.root.isAuthenticated);

    return (
        <nav>
            <Link to={routes.HOME}>Home</Link>
            {isAuthenticated &&
                <>
                    <Link to={routes.PROFILE}>Profile</Link>
                    <Link to={routes.MYORDERS}>MyOrders</Link>
                    <Link to={routes.CART}>Cart</Link>
                </>
            }
            {isAuthenticated ? <Link to="/" onClick={() => { dispatch(logout()) }}>Logout</Link> : <Link to={routes.LOGIN}>Login</Link>}

        </nav>
    )
}

export default Navbar