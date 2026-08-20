import axios from "axios";
import { API_URL } from "../config/config";

const category = axios.create({ baseURL: API_URL });
category.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchCatgeory = async () => (await category.get("/category")).data;
export const addCategory = async (data) =>
  (await category.post("/category", data)).data;
export const updateCategory = async (data, id) =>
  (await category.put(`/category/${id}`, data)).data;
export const deleteCategory = async (id) =>
  (await category.delete(`/category/${id}`)).data;
