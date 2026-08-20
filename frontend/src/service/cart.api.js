import axios from "axios";
import { API_URL } from "../config/config";

const cartApi = axios.create({ baseURL: API_URL });

cartApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getCartApi = async () => {
  const response = await cartApi.get("/cart");

  return response.data;
};

export const addToCartApi = async (data) => {
  const response = await cartApi.post("/cart/add", data);

  return response.data;
};

export const updateCartApi = async (itemId, quantity) => {
  const response = await cartApi.put(`/cart/item/${itemId}`, { quantity });

  return response.data;
};

export const removeCartApi = async (itemId) => {
  const response = await cartApi.delete(`/cart/item/${itemId}`);

  return response.data;
};

export const clearCartApi = async () => {
  const response = await cartApi.delete("/cart/clear");

  return response.data;
};
