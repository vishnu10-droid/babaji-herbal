import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addCategory,
  deleteCategory,
  fetchCatgeory,
  updateCategory,
} from "../../service/category.api";

const getError = (error) =>
  error.response?.data?.message || error.message || "Request failed";
const unwrap = (payload) => payload?.data || payload || [];

export const fetchCategories = createAsyncThunk(
  "category/fetchCategory",
  async (_, thunkAPI) => {
    try {
      return await fetchCatgeory();
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  },
);
export const createCategory = createAsyncThunk(
  "category/addCategory",
  async (data, thunkAPI) => {
    try {
      return await addCategory(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  },
);
export const updateCategorydata = createAsyncThunk(
  "category/updateCategory",
  async ({ data, id }, thunkAPI) => {
    try {
      return await updateCategory(data, id);
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  },
);
export const deleteCatgeorydata = createAsyncThunk(
  "category/deleteCategory",
  async (id, thunkAPI) => {
    try {
      await deleteCategory(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState: { data: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = unwrap(action.payload);
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.data.unshift(unwrap(action.payload));
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCategorydata.fulfilled, (state, action) => {
        const updated = unwrap(action.payload);
        const index = state.data.findIndex((item) => item._id === updated._id);
        if (index !== -1) state.data[index] = updated;
      })
      .addCase(updateCategorydata.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteCatgeorydata.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteCatgeorydata.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
