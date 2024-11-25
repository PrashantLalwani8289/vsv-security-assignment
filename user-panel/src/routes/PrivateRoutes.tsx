import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { RootState } from '../state_management/store/store';
import { logout } from '../state_management/actions/rootReducer';
import { ProtectedRoutesProps, TokenPayload, } from '../interfaces/authInterface';
import { useEffect } from 'react';

const PrivateRoutes: React.FC<ProtectedRoutesProps> = ({ isAuthenticated, children }) => {
    const dispatch = useDispatch();
    const TOKEN = useSelector((state: RootState) => state.root.user?.token);
    useEffect(() => {
        if (TOKEN) {
            if (isTokenExpired(TOKEN as string)) {
                dispatch(logout());
                <Navigate to="/login" />;
            }
        }
    }, [TOKEN]);

    const isTokenExpired = (token: string) => {
        try {
            const decoded: TokenPayload = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Convert to seconds
            return decoded.exp < currentTime;
        } catch (error) {
            console.error('Failed to decode token:', error);
            return true;
        }
    };
    if (!isAuthenticated || !TOKEN || isTokenExpired(TOKEN)) {
        dispatch(logout());
        return <Navigate to="/login" />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoutes;
