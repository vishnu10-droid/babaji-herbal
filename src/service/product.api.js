
import axios from "axios";

const products=axios.create({
    baseURL:"http://localhost:3000/api"
});

export const fetchproduct=async()=>{
  const response = await products.get("/products");
  return response.data;
}
export const addproduct=async(data)=>{
    const respone=await products.post("/products",data);
    return response.data;
}

export const updateproduct=async(data,id)=>{
    const response = await products.put(`/products/${id}`,data);
    return response.data;

}
export const deleteproduct=async(id)=>{
    const respone= await products.delete(`/products/${id}`);
    return response.data
}

