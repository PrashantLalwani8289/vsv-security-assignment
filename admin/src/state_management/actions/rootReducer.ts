import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FirstState,userData,permissionData, role } from "../../interfaces/authInterface"; 

const initialState:FirstState={
    isAuthenticated: false,
    user: null,
    token: '',
    permission:[],
    user_role:null
}
const rootSlice = createSlice({
    name: "root",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<userData>) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token='';
            state.permission=[];
            state.user_role=null;
        },
        token:(state,action: PayloadAction<string>)=>{
            state.token=action.payload;
        },
        permission: (state, action: PayloadAction<permissionData>) => {
            state.permission = [...state.permission, action.payload];
        },
        user_role:(state,action: PayloadAction<role>)=>{
            state.user_role=action.payload;
        }
    },
})
export const { login, logout, token,permission,user_role} = rootSlice.actions;

export default rootSlice.reducer
