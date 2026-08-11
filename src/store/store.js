import { configureStore } from "@reduxjs/toolkit";

import productReducer from "./slice/product.slice.js";
import categoryReducer from "./slice/category.slice.js";
export const store = configureStore({
  reducer: {
    product: productReducer,
    category: categoryReducer,
  },
});
