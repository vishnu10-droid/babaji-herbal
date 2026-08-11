
import axios from "axios";

const products=axios.create({
    baseURL:"http://localhost:3000/api/product"
});

export const fetchproduct=async()=>{
  const response = await products.get("/product");
  return response.data;
}
export const addproduct=async(data)=>{
    const respone=await products.post("/product",data);
    return response.data;
}

export const updateproduct=async(data,id)=>{
    const response = await products.put(`/product/ ${id}`,data);
    return response.data;

}
export const deleteproduct=async(id)=>{
    const respone= await products.delete(`/product/ ${id}`);
    return response.data
}

