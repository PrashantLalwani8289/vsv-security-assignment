import React from 'react';
import { Route, Routes } from 'react-router-dom';
import routes from './routes';
import { WithHeader } from './withHeader';
import Dashboard from '../components/dashboard/dashboard';
import CreateUsers from '../components/dashboard/users/CreateUsers';
import ShowUsers from '../components/dashboard/users/ShowUsers';
import Login from '../components/dashboard/auth/Login';
import ShowRoles from '../components/dashboard/roles/ShowRoles';
import { useSelector } from 'react-redux';
import { RootState } from '../state_management/store/store';
import PrivateRoute from './PrivateRoutes';
import permissions from './Permissions';
import AddRoles from '../components/dashboard/roles/AddRoles';
import ShowProductCategory from '../components/dashboard/product-category/ShowProductCategory';
import ShowProduct from '../components/dashboard/product/ShowProduct';
import AddProducts from '../components/dashboard/product/AddProducts';
import EditProducts from '../components/dashboard/product/EditProduct';
import EditUser from '../components/dashboard/users/EditUser';
import Orders from '../components/dashboard/orders/Orders';
import EditRole from '../components/dashboard/roles/EditRole';
import ShowCustomers from '../components/dashboard/customers/ShowCustomers';
import Profile from '../components/dashboard/Profile';
import Pin from '../components/dashboard/pin/Pin';

const PublicRoutes: React.FC = () => {
    const isAuthenticated = useSelector((state: RootState) => state.root.isAuthenticated);

    return (
        <div>
            <Routes>
                <Route
                    path={routes.HOME}
                    element={<WithHeader component={Dashboard} route={routes.HOME} isAuthenticated={isAuthenticated} />}
                />
                <Route
                    path={routes.ROOT}
                    element={<WithHeader component={Login} route={routes.ROOT} isAuthenticated={isAuthenticated} />}
                />
                <Route
                    path={routes.LOGIN}
                    element={<WithHeader component={Login} route={routes.LOGIN} isAuthenticated={isAuthenticated} />}
                />
                <Route
                    path={routes.MYPROFILE}
                    element={<WithHeader component={Profile} route={routes.MYPROFILE} isAuthenticated={isAuthenticated} />}
                />
                <Route
                    path={routes.PIN}
                    element={<WithHeader component={Pin} route={routes.PIN} isAuthenticated={isAuthenticated} />}
                />
                {/* USERS ROUTES */}
                <Route
                    element={<PrivateRoute isAuthenticated={isAuthenticated} requiredPermissions={permissions.users.CREATE_USER.name} />}
                >
                    <Route
                        path={routes.USERS_ADD}
                        element={<WithHeader component={CreateUsers} route={routes.USERS_ADD} isAuthenticated={isAuthenticated} />}
                    />
                </Route>
                <Route
                    element={<PrivateRoute isAuthenticated={isAuthenticated} requiredPermissions={permissions.users.VIEW_USER.name} />}
                >
                    <Route
                        path={routes.USERS}
                        element={<WithHeader component={ShowUsers} route={routes.USERS} isAuthenticated={isAuthenticated} />}
                    />
                </Route>
                <Route
                    element={<PrivateRoute isAuthenticated={isAuthenticated} requiredPermissions={permissions.users.EDIT_USER.name} />}
                >
                    <Route
                        path={routes.USERS_EDIT}
                        element={<WithHeader component={EditUser} route={routes.USERS_EDIT} isAuthenticated={isAuthenticated} />}
                    />
                </Route>
                {/* END USERS ROUTES */}
                {/* ROLES ROUTES */}
                <Route
                    element={<PrivateRoute isAuthenticated={isAuthenticated} requiredPermissions={permissions.roles.VIEW_ROLE.name} />}
                >
                    <Route
                        path={routes.ROLES}
                        element={<WithHeader component={ShowRoles} route={routes.ROLES} isAuthenticated={isAuthenticated} />}
                    />
                </Route>
                <Route
                    element={<PrivateRoute isAuthenticated={isAuthenticated} requiredPermissions={permissions.roles.CREATE_ROLE.name} />}
                >
                    <Route
                        path={routes.ROLES_ADD}
                        element={<WithHeader component={AddRoles} route={routes.ROLES_ADD} isAuthenticated={isAuthenticated} />}
                    />
                </Route>
                <Route
                    element={<PrivateRoute isAuthenticated={isAuthenticated} requiredPermissions={permissions.roles.EDIT_ROLE.name} />}
                >
                    <Route
                        path={routes.ROLES_EDIT}
                        element={<WithHeader component={EditRole} route={routes.ROLES_EDIT} isAuthenticated={isAuthenticated} />}
                    />
                </Route>
                {/* END ROLES ROUTES */}
                {/* PRODUCTS ROUTES */}
                <Route
                    element={<PrivateRoute isAuthenticated={isAuthenticated} requiredPermissions={permissions.products.VIEW_PRODUCT.name} />}
                >
                    <Route
                        path={routes.PRODUCT_CATEGORY}
                        element={<WithHeader component={ShowProductCategory} route={routes.PRODUCT_CATEGORY} isAuthenticated={isAuthenticated} />}
                    />
                </Route>
                <Route
                    element={<PrivateRoute isAuthenticated={isAuthenticated} requiredPermissions={permissions.products.VIEW_PRODUCT.name} />}
                >
                    <Route
                        path={routes.PRODUCTS}
                        element={<WithHeader component={ShowProduct} route={routes.PRODUCTS} isAuthenticated={isAuthenticated} />}
                    />
                </Route>
                <Route
                    element={<PrivateRoute isAuthenticated={isAuthenticated} requiredPermissions={permissions.products.CREATE_PRODUCT.name} />}
                >
                    <Route
                        path={routes.PRODUCTS_ADD}
                        element={<WithHeader component={AddProducts} route={routes.PRODUCTS_ADD} isAuthenticated={isAuthenticated} />}
                    />
                </Route>
                <Route
                    element={<PrivateRoute isAuthenticated={isAuthenticated} requiredPermissions={permissions.products.EDIT_PRODUCT.name} />}
                >
                    <Route
                        path={routes.PRODUCTS_EDIT}
                        element={<WithHeader component={EditProducts} route={routes.PRODUCTS_EDIT} isAuthenticated={isAuthenticated} />}
                    />
                </Route>
                {/* END PRODUCTS ROUTES */}
                {/* ORDERS ROUTES */}
                <Route
                    element={<PrivateRoute isAuthenticated={isAuthenticated} requiredPermissions={permissions.orders.VIEW_ORDER.name} />}
                >
                    <Route
                        path={routes.ORDERS_SHOW}
                        element={<WithHeader component={Orders} route={routes.ORDERS_SHOW} isAuthenticated={isAuthenticated} />}
                    />
                </Route>
                {/* END ORDERS ROUTES */}
                {/* CUSTOMERS ROUTES */}
                <Route
                    element={<PrivateRoute isAuthenticated={isAuthenticated} requiredPermissions={permissions.customer.VIEW_CUSTOMER.name} />}
                >
                    <Route
                        path={routes.CUSTOMERS_SHOW}
                        element={<WithHeader component={ShowCustomers} route={routes.CUSTOMERS_SHOW} isAuthenticated={isAuthenticated} />}
                    />
                </Route>
                {/* END CUSTOMERS ROUTES */}
            </Routes>




        </div>
    );
};

export default PublicRoutes;
