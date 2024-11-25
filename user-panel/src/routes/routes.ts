const routes = {
    HOME:'/',
    LOGIN:'/login',
    REGISTER: "/register",
    PROFILE:'/profile',
    MYORDERS:'/myorders',
    CART:'/cart',
    CHECKOUT:'/checkout',
}


export const beforeLoginRoutes = [
    routes.LOGIN,
    routes.REGISTER,
]
export const AfterLoginRoutes = [
]

export default routes;