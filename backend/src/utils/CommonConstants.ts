// ROLE PERMISSIONS
export const CREATE_ROLE_PERMISSIONS = ["roles-create"];
export const GET_ROLE_PERMISSIONS = ["roles-read"];
export const UPDATE_ROLE_PERMISSIONS = ["roles-update"];
// USER PERMISSIONS
export const CREATE_USER_PERMISSIONS = ["user-create"];
export const UPDATE_USER_PERMISSIONS = ["user-update"];
export const GET_USER_PERMISSIONS = ["user-read"];
// PRODUCTS PERMISSIONS
export const CREATE_PRODUCT_PERMISSIONS = ["products-create"];
export const READ_PRODUCT_PERMISSIONS = ["products-read"];
export const UPDATE_PRODUCT_PERMISSIONS = ["products-update"];
export const DELETE_PRODUCT_PERMISSIONS = ["products-delete"];
// ORDERS PERMISSIONS
export const READ_ORDER_PERMISSIONS = ["orders-read"];
export const UPDATE_ORDER_PERMISSIONS = ["orders-update"];
// CUSTOMERS PERMISSIONS 
export const READ_CUSTOMER_PERMISSIONS = ["customers-read"];
export const UPDATE_CUSTOMER_PERMISSIONS = ["customers-update"];


//  SOME JOI CONSTANTS
export const PASSWORD_REGEX=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/