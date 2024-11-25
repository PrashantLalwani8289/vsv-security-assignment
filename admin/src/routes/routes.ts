const routes = {
    ROOT:'/',
    HOME: '/admin/dashboard',
    LOGIN: '/admin/login',
    REGISTER: "/admin/register",
    MYPROFILE: '/admin/profile',
    USERS: '/admin/users',
    USERS_ADD: '/admin/user-add',
    USERS_EDIT: '/admin/user-edit',
    ROLES:'/admin/roles',
    ROLES_ADD: '/admin/roles-add',
    ROLES_EDIT: '/admin/roles-edit',
    PRODUCT_CATEGORY: '/admin/product-category',
    PRODUCTS: '/admin/products',
    PRODUCTS_ADD: '/admin/products-add',
    PRODUCTS_EDIT: '/admin/products-edit',
    ORDERS_SHOW: '/admin/orders',
    CUSTOMERS_SHOW: '/admin/customers',
    PIN:'/admin/pin',
}


export const beforeLoginRoutes = [
    routes.LOGIN,
    routes.ROOT
]
export const AfterLoginRoutes = [
    routes.HOME,
    routes.MYPROFILE,
    routes.USERS,
    routes.USERS_ADD,
    routes.ROLES,
    routes.ROLES_ADD,
    routes.PRODUCT_CATEGORY,
    routes.PRODUCTS,
    routes.PRODUCTS_ADD,
    routes.PRODUCTS_EDIT,
    routes.USERS_EDIT,
    routes.ORDERS_SHOW,
    routes.ROLES_EDIT,
    routes.CUSTOMERS_SHOW,
    routes.PIN,
]

export default routes;