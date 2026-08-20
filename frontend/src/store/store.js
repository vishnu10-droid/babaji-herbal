import { configureStore } from "@reduxjs/toolkit";

import productReducer from "./slice/product.Slice.js";
import categoryReducer from "./slice/category.slice.js";
import cartReducer from "./slice/cart.slice.js";
import wishlistReducer from "./slice/wishlist.slice.js";
import ContactReducer from "../store/slice/contact.slice.js"
import authReducer from "../store/slice/auth.slice"
export const store = configureStore({
  reducer: {
    product: productReducer,
    category: categoryReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    Contact: ContactReducer,
    auth:authReducer,
  },
});
