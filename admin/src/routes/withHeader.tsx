import React from 'react';
// import Header from '../components/header/Header';
// import ProtectedRoutes from './ProtectedRoutes';
// import Sidebar from "../components/dashboard/sidebar";

interface WithHeaderProps {
    component: React.ComponentType;
    route: string;
    isAuthenticated: boolean;
}

export const WithHeader: React.FC<WithHeaderProps> = (props) => {
    const { component: Component,route, isAuthenticated, ...rest } = props;

    return (
        <>
            {/* <Sidebar isAuthenticated={isAuthenticated} /> */}
            {/* <ProtectedRoutes isAuthenticated={isAuthenticated}> */}
                <Component {...rest} />
            {/* </ProtectedRoutes> */}
        </>
    );
};
