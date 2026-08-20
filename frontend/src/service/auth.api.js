import axios from "axios";
import { API_URL } from "../config/config";

const api = axios.create({
  baseURL: `${API_URL}/auth`,
});

// REGISTER
export const register = async (data) => {
  const response = await api.post("/register", data);

  return response.data;
};

// LOGIN
export const login = async (data) => {
  const response = await api.post("/login", data);

  return response.data;
};

// ADMIN LOGIN
export const adminLogin = async (data) => {
  const response = await api.post("/admin/login", data);

  return response.data;
};

// GET PROFILE
export const getProfile = async (token) => {
  const response = await api.get("/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// UPDATE PROFILE
export const updateProfile = async (data, token) => {
  const response = await api.put("/profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// GET USERS
export const getUsers = async (token) => {
  const response = await api.get("/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// LOGOUT
export const logout = async (token) => {
  const response = await api.post(
    "/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
