import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getCartApi,
  addToCartApi,
  updateCartApi,
  removeCartApi,
  clearCartApi,
} from "../../service/cart.api";

// ========================================
// GET CART
// ========================================

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const response = await getCartApi();

      return response.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ========================================
// ADD CART
// ========================================

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (data, thunkAPI) => {
    try {
      const response = await addToCartApi(data);

      return response.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ========================================
// UPDATE CART
// ========================================

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ itemId, quantity }, thunkAPI) => {
    try {
      const response = await updateCartApi(itemId, quantity);

      return response.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ========================================
// REMOVE ITEM
// ========================================

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (itemId, thunkAPI) => {
    try {
      const response = await removeCartApi(itemId);

      return response.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ========================================
// CLEAR CART
// ========================================

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, thunkAPI) => {
    try {
      const response = await clearCartApi();

      return response.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// ========================================
// INITIAL STATE
// ========================================

const initialState = {
  items: [],
  totalAmount: 0,
  loading: false,
  error: null,
};

// ========================================
// SLICE
// ========================================

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    resetCart: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      // GET
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;

        state.items = action.payload?.items || [];

        state.totalAmount = action.payload?.totalAmount || 0;
      })

      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload?.items || [];

        state.totalAmount = action.payload?.totalAmount || 0;
      })

      // UPDATE (optimistic — price turant badhe)
      .addCase(updateCartItem.pending, (state, action) => {
        const { itemId, quantity } = action.meta.arg || {};
        if (!itemId || !quantity || quantity < 1) return;
        state.items = state.items.map((item) =>
          item._id === itemId ? { ...item, quantity } : item
        );
        state.totalAmount = state.items.reduce(
          (sum, item) =>
            sum + Number(item.price || 0) * Number(item.quantity || 0),
          0
        );
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload?.items || [];

        state.totalAmount = action.payload?.totalAmount || 0;
      })

      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload;
      })

      // REMOVE (optimistic)
      .addCase(removeCartItem.pending, (state, action) => {
        const itemId = action.meta.arg;
        if (!itemId) return;
        state.items = state.items.filter((item) => item._id !== itemId);
        state.totalAmount = state.items.reduce(
          (sum, item) =>
            sum + Number(item.price || 0) * Number(item.quantity || 0),
          0
        );
      })

      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = action.payload?.items || [];

        state.totalAmount = action.payload?.totalAmount || 0;
      })

      .addCase(removeCartItem.rejected, (state, action) => {
        state.error = action.payload;
      })

      // CLEAR
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalAmount = 0;
      });
  },
});

export const { resetCart } = cartSlice.actions;

export default cartSlice.reducer;
