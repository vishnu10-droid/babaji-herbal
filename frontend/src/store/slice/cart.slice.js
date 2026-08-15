import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

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

export const fetchCart =
  createAsyncThunk(
    "cart/fetchCart",
    async (_, thunkAPI) => {
      try {
        const response =
          await getCartApi();

        return response.cart;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

// ========================================
// ADD CART
// ========================================

export const addToCart =
  createAsyncThunk(
    "cart/addToCart",
    async (data, thunkAPI) => {
      try {
        const response =
          await addToCartApi(data);

        return response.cart;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

// ========================================
// UPDATE CART
// ========================================

export const updateCartItem =
  createAsyncThunk(
    "cart/updateCartItem",
    async (
      { itemId, quantity },
      thunkAPI
    ) => {
      try {
        const response =
          await updateCartApi(
            itemId,
            quantity
          );

        return response.cart;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

// ========================================
// REMOVE ITEM
// ========================================

export const removeCartItem =
  createAsyncThunk(
    "cart/removeCartItem",
    async (itemId, thunkAPI) => {
      try {
        const response =
          await removeCartApi(
            itemId
          );

        return response.cart;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

// ========================================
// CLEAR CART
// ========================================

export const clearCart =
  createAsyncThunk(
    "cart/clearCart",
    async (_, thunkAPI) => {
      try {
        const response =
          await clearCartApi();

        return response.cart;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
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

  reducers: {},

  extraReducers: (builder) => {
    builder

      // GET
      .addCase(
        fetchCart.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchCart.fulfilled,
        (state, action) => {
          state.loading = false;

          state.items =
            action.payload?.items || [];

          state.totalAmount =
            action.payload
              ?.totalAmount || 0;
        }
      )

      .addCase(
        fetchCart.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload;
        }
      )

      // ADD
      .addCase(
        addToCart.fulfilled,
        (state, action) => {
          state.items =
            action.payload?.items || [];

          state.totalAmount =
            action.payload
              ?.totalAmount || 0;
        }
      )

      // UPDATE
      .addCase(
        updateCartItem.fulfilled,
        (state, action) => {
          state.items =
            action.payload?.items || [];

          state.totalAmount =
            action.payload
              ?.totalAmount || 0;
        }
      )

      // REMOVE
      .addCase(
        removeCartItem.fulfilled,
        (state, action) => {
          state.items =
            action.payload?.items || [];

          state.totalAmount =
            action.payload
              ?.totalAmount || 0;
        }
      )

      // CLEAR
      .addCase(
        clearCart.fulfilled,
        (state) => {
          state.items = [];
          state.totalAmount = 0;
        }
      );
  },
});

export default cartSlice.reducer;