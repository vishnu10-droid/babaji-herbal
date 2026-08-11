import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCatgeory,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../service/category.api";
export const fetchCategories = createAsyncThunk(
  "category/fetchCategory",
  async (_, thunkAPI) => {
    try {
      const response = await fetchCatgeory();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);
export const createCategory = createAsyncThunk(
  "category/addCategory",
  async (data, thunkAPI) => {
    try {
      const response = await addCategory(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);
export const updateCategorydata = createAsyncThunk(
  "category/updateCategory",
  async ({ data, id }, thunkAPI) => {
    try {
      const response = await updateCategory(data, id);
      return respone;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);
export const deleteCatgeorydata = createAsyncThunk(
  "category/deleteCategory",
  async (id, thunkAPI) => {
    try {
      const response = await deleteCategory(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  extraReducers: (builder) => {
    builder

      // ==========================================
      // GET CATEGORIES
      // ==========================================

      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
      })

      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================================
      // ADD CATEGORY
      // ==========================================

      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.data.unshift(action.payload);
      })

      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================================
      // UPDATE CATEGORY
      // ==========================================

      .addCase(updateCategorydata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateCategorydata.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const updatedCategory = action.payload;

        const index = state.data.findIndex(
          (item) => item._id === updatedCategory._id,
        );

        if (index !== -1) {
          state.data[index] = updatedCategory;
        }
      })

      .addCase(updateCategorydata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================================
      // DELETE CATEGORY
      // ==========================================

      .addCase(deleteCatgeorydata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteCatgeorydata.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.data = state.data.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteCatgeorydata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default categorySlice.reducer;
