import React from 'react';
import Navbar from '../components/user/Navbar';

interface WithHeaderProps {
    component: React.ComponentType;
    route: string;
    isAuthenticated: boolean;
}

export const WithHeader: React.FC<WithHeaderProps> = (props) => {
    const { component: Component, route, isAuthenticated, ...rest } = props;

    return (
        <>
            <Navbar />
            <Component {...rest} />
        </>
    );
};
