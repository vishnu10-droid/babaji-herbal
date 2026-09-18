import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  register,
  login,
  logout,
  adminLogin,
  getProfile,
  getUsers,
  updateProfile,
} from "../../service/auth.api";

// ===============================
// REGISTER
// ===============================
export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await register(data);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

// ===============================
// LOGIN
// ===============================
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await login(data);

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

// ===============================
// ADMIN LOGIN
// ===============================
export const adminLoginUser = createAsyncThunk(
  "auth/adminLogin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await adminLogin(data);

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Admin login failed",
      );
    }
  },
);

// ===============================
// GET PROFILE
// ===============================
export const fetchProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const response = await getProfile(token);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get profile",
      );
    }
  },
);

// ===============================
// UPDATE PROFILE
// ===============================
export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const response = await updateProfile(data, token);

      localStorage.setItem("user", JSON.stringify(response.data));

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile",
      );
    }
  },
);

// ===============================
// GET USERS
// ===============================
export const fetchUsers = createAsyncThunk(
  "auth/getUsers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const response = await getUsers(token);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get users",
      );
    }
  },
);

// ===============================
// LOGOUT
// ===============================
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const response = await logout(token);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return response;
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  },
);

// ===============================
// INITIAL STATE
// ===============================
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,

  users: [],

  loading: false,
  error: null,
  success: false,
};

// ===============================
// SLICE
// ===============================
const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    clearSuccess: (state) => {
      state.success = false;
    },

    logoutLocal: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },

  extraReducers: (builder) => {
    builder

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.user = action.payload.data;
        state.token = action.payload.token;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // ADMIN LOGIN
      .addCase(adminLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(adminLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.user = action.payload.data;
        state.token = action.payload.token;
      })

      .addCase(adminLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PROFILE
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })

      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE PROFILE
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.data;
      })

      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET USERS
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.success = false;
        state.error = null;
      })

      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, logoutLocal } = authSlice.actions;

export default authSlice.reducer;
