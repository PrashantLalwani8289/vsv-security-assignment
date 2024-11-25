import React from 'react';
import { Route, Routes } from 'react-router-dom';
import routes from './routes';
import { WithHeader } from './withHeader';
import { useSelector } from 'react-redux';
import { RootState } from '../state_management/store/store';
// import PrivateRoute from './PrivateRoutes';
import Home from '../components/user/Home';
import Login from '../components/user/auth/Login';
import Register from '../components/user/auth/Register';
import Profile from '../components/user/Profile/Profile';
import Cart from '../components/user/cart/Cart';
import Checkout from '../components/user/cart/Checkout';
import MyOrder from '../components/user/cart/MyOrder';
import PrivateRoutes from './PrivateRoutes';

const PublicRoutes: React.FC = () => {
    const isAuthenticated = useSelector((state: RootState) => state.root.isAuthenticated);

    return (
        <div>
            <Routes>
                {/* START END-USERPANEL ROUTES */}
                <Route
                    path={routes.HOME}
                    element={<WithHeader component={Home} route={routes.HOME} isAuthenticated={isAuthenticated} />}
                />
                <Route
                    path={routes.LOGIN}
                    element={<WithHeader component={Login} route={routes.LOGIN} isAuthenticated={isAuthenticated} />}
                />
                <Route
                    path={routes.REGISTER}
                    element={<WithHeader component={Register} route={routes.REGISTER} isAuthenticated={isAuthenticated} />}
                />
                {/* START PRIVATE ROUTES */}
                <Route
                    element={<PrivateRoutes isAuthenticated={isAuthenticated} />}
                >
                    <Route
                        path={routes.PROFILE}
                        element={<WithHeader component={Profile} route={routes.PROFILE} isAuthenticated={isAuthenticated} />}
                    />
                    <Route
                        path={routes.CART}
                        element={<WithHeader component={Cart} route={routes.CART} isAuthenticated={isAuthenticated} />}
                    />
                    <Route
                        path={routes.CHECKOUT}
                        element={<WithHeader component={Checkout} route={routes.CHECKOUT} isAuthenticated={isAuthenticated} />}
                    />
                    <Route
                        path={routes.MYORDERS}
                        element={<WithHeader component={MyOrder} route={routes.MYORDERS} isAuthenticated={isAuthenticated} />}
                    />
                </Route>
                {/* END PRIVATE ROUTES */}
                {/* END  END-USERPANEL ROUTES */}
            </Routes>
        </div>
    );
};

export default PublicRoutes;
