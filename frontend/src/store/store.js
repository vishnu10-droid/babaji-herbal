import { configureStore } from "@reduxjs/toolkit";

import productReducer from "./slice/product.Slice.js";
import categoryReducer from "./slice/category.slice.js";
import cartReducer from "./slice/cart.slice.js";
export const store = configureStore({
  reducer: {
    product: productReducer,
    category: categoryReducer,
    cart: cartReducer,
  },
});
