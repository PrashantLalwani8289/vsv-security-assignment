import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FirstState,userData } from "../../interfaces/authInterface"; 

const initialState:FirstState={
    isAuthenticated: false,
    user: null,
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
        }
    },
})
export const { login, logout} = rootSlice.actions;

export default rootSlice.reducer
