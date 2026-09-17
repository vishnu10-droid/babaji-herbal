import axios from "axios";

import { API_URL } from "../config/config";

const heroApi = axios.create({
  baseURL: API_URL,
});

heroApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* =========================
   GET ALL
========================= */

export const getHeroSlides = async () => {
  const response = await heroApi.get("/hero-slides");

  return response.data;
};

/* =========================
   GET ACTIVE
========================= */

export const getActiveHeroSlides = async () => {
  const response = await heroApi.get("/hero-slides/active");

  return response.data;
};

/* =========================
   CREATE
========================= */

export const createHeroSlide = async (formData) => {
  const response = await heroApi.post(
    "/hero-slides",
    formData
  );

  return response.data;
};

/* =========================
   UPDATE
========================= */

export const updateHeroSlide = async (id, formData) => {
  const response = await heroApi.put(
    `/hero-slides/${id}`,
    formData
  );

  return response.data;
};

/* =========================
   DELETE
========================= */

export const deleteHeroSlide = async (id) => {
  const response = await heroApi.delete(
    `/hero-slides/${id}`
  );

  return response.data;
};

/* =========================
   TOGGLE
========================= */

export const toggleHeroSlide = async (id) => {
  const response = await heroApi.patch(
    `/hero-slides/${id}/toggle`
  );

  return response.data;
};
