import axios from "axios";
import { API_URL } from "../config/config";

const products = axios.create({ baseURL: API_URL });
products.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchproduct = async (params) =>
  (await products.get("/products", { params })).data;
export const addproduct = async (data) =>
  (await products.post("/products", data)).data;
export const updateproduct = async (data, id) =>
  (await products.put(`/products/${id}`, data)).data;
export const deleteproduct = async (id) =>
  (await products.delete(`/products/${id}`)).data;
