import axios from "axios";

import { API_URL } from "../config/config";

const wishlistApi = axios.create({ baseURL: API_URL });

wishlistApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export const getWishlistApi = async () => {
  const response = await wishlistApi.get("/wishlist");
  return response.data;
};

export const addToWishlistApi = async (productId) => {
  const response = await wishlistApi.post("/wishlist", { productId });
  return response.data;
};

export const removeFromWishlistApi = async (productId) => {
  const response = await wishlistApi.delete(`/wishlist/${productId}`);
  return response.data;
};

export const clearWishlistApi = async () => {
  const response = await wishlistApi.delete("/wishlist");
  return response.data;
};
