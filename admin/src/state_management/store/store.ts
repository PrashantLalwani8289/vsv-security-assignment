import { configureStore } from "@reduxjs/toolkit";
import  rootReducer  from "../actions/rootReducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: "root",
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: {
        root: persistedReducer,
    },
});

export const persistor = persistStore(store);
// export default store;
export type RootState = ReturnType<typeof store.getState>;