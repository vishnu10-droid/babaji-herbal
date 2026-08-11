import axios from "axios";

const category = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const fetchCatgeory = async () => {
  const response = await category.get("/category");
  return response.data;
};
export const addCategory = async (data) => {
  const response = await category.post("/category", data);
  return response.data;
};
export const updateCategory = async (data, id) => {
  const response = await category.put(`/category/${id}`, data);
  return response.data;
};
export const deleteCategory = async (id) => {
  const response = await category.delete(`/category/${id}`);
  return response.data;
};
