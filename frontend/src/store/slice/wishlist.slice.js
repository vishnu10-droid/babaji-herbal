import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  addToWishlistApi,
  clearWishlistApi,
  getWishlistApi,
  removeFromWishlistApi,
} from "../../service/wishlist.api";

const getError = (error) =>
  error.response?.data?.message || error.message || "Request failed";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, thunkAPI) => {
    try {
      const response = await getWishlistApi();
      return response.wishlist || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, thunkAPI) => {
    try {
      const response = await addToWishlistApi(productId);
      return response.wishlist;
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, thunkAPI) => {
    try {
      await removeFromWishlistApi(productId);
      return productId;
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  }
);

export const clearWishlist = createAsyncThunk(
  "wishlist/clearWishlist",
  async (_, thunkAPI) => {
    try {
      await clearWishlistApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    resetWishlist: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        if (action.payload && !state.items.some((item) => item._id === action.payload._id)) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeFromWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => {
          const itemProductId = item.product?._id || item.product;
          return String(itemProductId) !== String(action.payload);
        });
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.items = [];
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
