import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login } from "../../api/auth.api";

// LOGIN API
export const loginUser = createAsyncThunk(
  "login/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await login(formData);

      // Save login data
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
  success: false,
};

const loginSlice = createSlice({
  name: "login",

  initialState,

  reducers: {
    clearLoginError: (state) => {
      state.error = null;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.success = false;
      state.error = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN PENDING
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      // LOGIN SUCCESS
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.user = action.payload.data;
        state.token = action.payload.token;
      })

      // LOGIN ERROR
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { clearLoginError, logout } = loginSlice.actions;

export default loginSlice.reducer;
