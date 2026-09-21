import axios from "axios";
import { API_URL } from "../config/config";

const paymentApi = axios.create({ baseURL: API_URL });

paymentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Backend recalculates the amount from DB cart — frontend never sends amount.
export const createRazorpayOrder = (payload) =>
  paymentApi.post("/payment/create-order", payload).then((r) => r.data);

export const verifyRazorpayPayment = (payload) =>
  paymentApi.post("/payment/verify", payload).then((r) => r.data);

export const markPaymentFailed = (payload) =>
  paymentApi.post("/payment/failed", payload).then((r) => r.data);

export const getRazorpayKey = () =>
  paymentApi.get("/payment/key").then((r) => r.data?.keyId);

export const validateCouponCode = (code, orderTotal) =>
  axios
    .create({ baseURL: API_URL })
    .post("/coupons/validate", { code, orderTotal })
    .then((r) => r.data);
