import axios from "axios";
import { API_URL } from "../config/config";

// =====================================================
// UPLOAD API
//
// Files frontend se backend par jaati hain. Backend
// ImageKit par upload karke { url, fileId } return
// karta hai. Private key hamesha backend par hi
// rehti hai.
// =====================================================

const upload = axios.create({ baseURL: API_URL });

upload.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const toFormData = (files, field) => {
  const data = new FormData();
  const list = Array.isArray(files) ? files : [files];
  list.forEach((file) => data.append(field, file));
  return data;
};

// =====================================================
// UPLOAD SINGLE IMAGE
// =====================================================

export const uploadImage = async (file, folder = "products") => {
  const response = await upload.post(
    `/upload/image/${folder}`,
    toFormData(file, "image"),
  );

  if (!response.data?.success) {
    throw new Error(
      response.data?.message || "Image upload failed",
    );
  }

  return response.data;
};

// =====================================================
// UPLOAD MULTIPLE IMAGES
// =====================================================

export const uploadImages = async (files, folder = "products") => {
  const response = await upload.post(
    `/upload/images/${folder}`,
    toFormData(files, "images"),
  );

  if (!response.data?.success) {
    throw new Error(
      response.data?.message || "Image upload failed",
    );
  }

  return response.data;
};