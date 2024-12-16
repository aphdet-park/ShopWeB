import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./reducer/cartSlice";

export const store = configureStore ({
    reducer  : {
        cart : cartSlice,
    },
});
