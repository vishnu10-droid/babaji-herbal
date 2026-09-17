import axios from "axios";
import { API_URL } from "../config/config";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Logged-in customer's own orders
export const getMyOrders = () => api.get("/orders").then((r) => r.data.orders || []);
