import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contact: {
    name: "",
    email: "",
    message: "",
  },
  loading: false,
  error: null,
  success: false,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,

  reducers: {
    setContact: (state, action) => {
      state.contact = {
        ...state.contact,
        ...action.payload,
      };
    },

    clearContact: (state) => {
      state.contact = {
        name: "",
        email: "",
        message: "",
      };
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setSuccess: (state, action) => {
      state.success = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setContact,
  clearContact,
  setLoading,
  setSuccess,
  setError,
} = contactSlice.actions;

export default contactSlice.reducer;