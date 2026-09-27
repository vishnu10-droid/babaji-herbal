import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  fetchproduct as getProducts,
  addproduct,
  updateproduct as updateProductApi,
  deleteproduct as deleteProductApi,
} from "../../service/product.api";

const unwrapProduct = (payload) => payload?.product || payload?.data || payload;

// GET PRODUCT (60s cache: dobara page khulne par turant data dikhega,
// background me fresh hoga — baar-baar lag nahi lagega)
const CACHE_TTL = 60 * 1000;

export const fetchproduct = createAsyncThunk(
  "product/fetchproduct",
  async (params, thunkAPI) => {
    try {
      const response = await getProducts(params);
      return { response, params };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  },
  {
    condition: (params, { getState }) => {
      const { product } = getState();
      const key = JSON.stringify(params || {});
      const now = Date.now();
      // Same params + fresh cache + already data => skip refetch
      if (
        product.lastFetchedKey === key &&
        product.lastFetchedAt &&
        now - product.lastFetchedAt < CACHE_TTL &&
        product.data?.length
      ) {
        return false;
      }
      return true;
    },
  }
);

// ADD PRODUCT
export const createproduct = createAsyncThunk(
  "product/addproduct",
  async (data, thunkAPI) => {
    try {
      const response = await addproduct(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// UPDATE PRODUCT
export const updateproduct = createAsyncThunk(
  "product/updateproduct",
  async ({ data, id }, thunkAPI) => {
    try {
      const response = await updateProductApi(data, id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// DELETE PRODUCT
export const deleteproduct = createAsyncThunk(
  "product/deleteproduct",
  async (id, thunkAPI) => {
    try {
      const response = await deleteProductApi(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// INITIAL STATE
const initialState = {
  data: [],
  loading: false,
  error: null,
  lastFetchedAt: 0,
  lastFetchedKey: "",
};

// SLICE
const productSlice = createSlice({
  name: "product",

  initialState,

  extraReducers: (builder) => {
    // GET
    builder
      .addCase(fetchproduct.pending, (state) => {
        // Purana data turant dikhta rahe, spinner sirf first load par
        if (!state.data?.length) state.loading = true;
        state.error = null;
      })

      .addCase(fetchproduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const payload = action.payload?.response ?? action.payload;
        state.data = Array.isArray(payload) ? payload : unwrapProduct(payload);
        state.lastFetchedAt = Date.now();
        state.lastFetchedKey = JSON.stringify(action.payload?.params || {});
      })

      .addCase(fetchproduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(createproduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createproduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const newProduct = unwrapProduct(action.payload);

        state.data.push(newProduct);
      })

      .addCase(createproduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateproduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateproduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const updatedProduct = unwrapProduct(action.payload);

        const index = state.data.findIndex(
          (product) => product._id === updatedProduct._id
        );

        if (index !== -1) {
          state.data[index] = updatedProduct;
        }
      })

      .addCase(updateproduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteproduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteproduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const deletedId =
          action.payload?.data?._id ||
          action.payload?._id ||
          action.meta.arg;

        state.data = state.data.filter(
          (product) => product._id !== deletedId
        );
      })

      .addCase(deleteproduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
