import axios from "axios";

import { API_URL } from "../config/config";

const couponApi = axios.create({
  baseURL: API_URL,
});

couponApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getCoupons = async () => {
  const response = await couponApi.get("/coupons");
  return response.data.coupons || [];
};

export const createCoupon = async (payload) => {
  const response = await couponApi.post("/coupons", payload);
  return response.data.coupon;
};

export const updateCoupon = async (id, payload) => {
  const response = await couponApi.put(`/coupons/${id}`, payload);
  return response.data.coupon;
};

export const deleteCoupon = async (id) => {
  const response = await couponApi.delete(`/coupons/${id}`);
  return response.data;
};
