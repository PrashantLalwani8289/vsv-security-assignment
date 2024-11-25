// permissions.ts
const permissions = {
    users: {
        CREATE_USER: {
            name: 'user-create',
            id: '667a8562c1d466461c553f39'
        },
        VIEW_USER: {
            name: 'user-read',
            id: '667a8579c1d466461c553f3b'
        },
        EDIT_USER: {
            name: 'user-update',
            id: '667a857fc1d466461c553f3d'
        },
        DELETE_USER: {
            name: 'user-delete',
            id: '667a8585c1d466461c553f3f'
        }
    },
    roles: {
        CREATE_ROLE: {
            name: 'roles-create',
            id: '667a858dc1d466461c553f41'
        },
        VIEW_ROLE: {
            name: 'roles-read',
            id: '667a8593c1d466461c553f43'
        },
        EDIT_ROLE: {
            name: 'roles-update',
            id: '667a859ac1d466461c553f45'
        },
        DELETE_ROLE: {
            name: 'roles-delete',
            id: '66839a7ffe48bdf3e210ade3'
        }
    },
    products:{
        CREATE_PRODUCT: {
            name: 'products-create',
            id: '6684e16eb3a7dc6d3b761e37'
        },
        VIEW_PRODUCT: {
            name: 'products-read',
            id: '6684e17ab3a7dc6d3b761e39'
        },
        EDIT_PRODUCT: {
            name: 'products-update',
            id: '6684e183b3a7dc6d3b761e3b'
        },
        DELETE_PRODUCT: {
            name: 'products-delete',
            id: '6684e18fb3a7dc6d3b761e3d'
        }
    },
    orders:{
        VIEW_ORDER: {
            name: 'orders-read',
            id: '668d370907aa3715741df7f6'
        },
        EDIT_ORDER: {
            name: 'orders-update',
            id: '668d371107aa3715741df7f8'
        }
    },
    customer:{
        VIEW_CUSTOMER: {
            name: 'customers-read',
            id: '668e51be41687f6f4774b102'
        },
        EDIT_CUSTOMER: {
            name: 'customers-update',
            id: '66965bfeefecfc41c414cc4a'
        }
    }
};


export  default permissions;
