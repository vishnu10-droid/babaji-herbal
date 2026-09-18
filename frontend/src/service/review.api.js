import axios from "axios";
import { API_URL } from "../config/config";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const createReview = (payload) => api.post("/reviews", payload).then((r) => r.data);
export const getMyReviews = () => api.get("/reviews/my").then((r) => r.data.reviews || []);
export const deleteMyReview = (id) => api.delete(`/reviews/${id}`).then((r) => r.data);
export const getProductReviews = (productId) =>
  api.get(`/reviews/product/${productId}`).then((r) => r.data);
