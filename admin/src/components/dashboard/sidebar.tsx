// import {User} from 'feather-icons'
import { FaUsers, FaSuitcaseRolling, FaUserClock, FaCartArrowDown,FaMapPin  } from "react-icons/fa"
import { FaCartShopping, FaPaypal, FaPeopleGroup } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import routes from "../../routes/routes";
import '../../../public/adminKit/js/app.js'
import { useSelector } from "react-redux";
import { RootState } from "../../state_management/store/store.js";
import { permissionData } from "../../interfaces/authInterface.js";
interface SidebarProps {
    isAuthenticated: boolean;
    sidebarRef: React.RefObject<HTMLDivElement>;
}
const sidebar: React.FC<SidebarProps> = ({ sidebarRef }) => {
    const navigate = useNavigate()
    const permissions = useSelector((state: RootState) => state.root.permission)
    const Username = useSelector((state: RootState) => state.root.user?.username);
    let PermissionString = "";
    permissions.forEach((items: any) => {
        items.forEach((item: permissionData) => {
            PermissionString += item.name + " ";
        });
    });
    return (
        <nav id="sidebar" className="sidebar js-sidebar " ref={sidebarRef}>
            <div className="sidebar-content js-simplebar">
                <a className="sidebar-brand" href="index.html">
                    <span className="align-middle">{Username}</span>
                </a>
                <ul className="sidebar-nav">
                    <li className="sidebar-header">Pages</li>
                    <li className="sidebar-item " onClick={() => {
                        navigate(routes.HOME)
                    }}>
                        <a className="sidebar-link" >
                            <i className="align-middle" />{<span>{<FaUserClock />}</span>}
                            <span className="align-middle">Dashboard </span>
                        </a>
                    </li>

                    {/* User Module */}
                    {
                        PermissionString.includes("user") &&
                        <li className="sidebar-item" onClick={() => {
                            navigate(routes.USERS)
                        }} >
                            <a className="sidebar-link" >
                                <i className="align-middle" />{<span>{<FaUsers />}</span>}
                                <span className="align-middle">Users</span>
                            </a>
                        </li>
                    }
                    {/* roles Module */}

                    {
                        PermissionString.includes("roles") &&
                        <li className="sidebar-item " onClick={() => {
                            navigate(routes.ROLES)
                        }}>
                            <a className="sidebar-link" >
                                <i className="align-middle" />{<span>{<FaSuitcaseRolling />}</span>}
                                <span className="align-middle">Roles</span>
                            </a>
                        </li>
                    }
                    {/* Employee Module */}

                    {
                        PermissionString.includes("employee") &&
                        <li className="sidebar-item " onClick={() => {
                            navigate(routes.ROLES)
                        }}>
                            <a className="sidebar-link" >
                                <i className="align-middle" />{<span>{<FaSuitcaseRolling />}</span>}
                                <span className="align-middle">Employees</span>
                            </a>
                        </li>
                    }
                    {/* ECOMMERCE MODULES */}
                    {
                        PermissionString.includes("products") &&
                        <>
                            <li className="sidebar-header">Ecommerce</li>
                            <li className="sidebar-item " onClick={() => {
                                navigate(routes.PRODUCT_CATEGORY);
                            }}>
                                <a className="sidebar-link">
                                    <i className="align-middle" />{<span>{<FaCartArrowDown />}</span>}
                                    <span className="align-middle">Products-category</span>
                                </a>
                            </li>
                            <li className="sidebar-item " onClick={() => {
                                navigate(routes.PRODUCTS);
                            }}>
                                <a className="sidebar-link">
                                    <i className="align-middle" />{<span>{<FaCartShopping />}</span>}
                                    <span className="align-middle">Products</span>
                                </a>
                            </li>
                        </>
                    }
                    {
                        PermissionString.includes("orders") &&
                        <li className="sidebar-item " onClick={() => {
                            navigate(routes.PIN);
                        }}>
                            <a className="sidebar-link">
                                <i className="align-middle" />{<span>{<FaMapPin  />}</span>}
                                <span className="align-middle">Pins</span>
                            </a>
                        </li>
                    }
                    {
                        PermissionString.includes("orders") &&
                        <li className="sidebar-item " onClick={() => {
                            navigate(routes.ORDERS_SHOW);
                        }}>
                            <a className="sidebar-link">
                                <i className="align-middle" />{<span>{<FaPaypal />}</span>}
                                <span className="align-middle">Orders</span>
                            </a>
                        </li>
                    }
                    {
                        PermissionString.includes("customers") &&
                        <li className="sidebar-item " onClick={() => {
                            navigate(routes.CUSTOMERS_SHOW);
                        }}>
                            <a className="sidebar-link">
                                <i className="align-middle" />{<span>{<FaPeopleGroup />}</span>}
                                <span className="align-middle">Customers</span>
                            </a>
                        </li>
                    }
                </ul>
            </div>
        </nav>

    )
}

export default sidebar