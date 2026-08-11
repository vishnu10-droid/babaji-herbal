import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  fetchproduct as getProducts,
  addproduct,
  updateproduct as updateProductApi,
  deleteproduct as deleteProductApi,
} from "../../service/product.api";

// GET PRODUCT
export const fetchproduct = createAsyncThunk(
  "product/fetchproduct",
  async (_, thunkAPI) => {
    try {
      const response = await getProducts();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
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
};

// SLICE
const productSlice = createSlice({
  name: "product",

  initialState,

  extraReducers: (builder) => {
    // GET
    builder
      .addCase(fetchproduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchproduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload.data || action.payload;
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

        const newProduct = action.payload.data || action.payload;

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

        const updatedProduct = action.payload.data || action.payload;

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