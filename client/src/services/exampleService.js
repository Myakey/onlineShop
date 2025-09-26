import axios from "axios";
import {api, auth} from "./api";

export const getProducts = () => api.get("/products");

export const createProduct = (productData) => {
  const formData = new FormData();
  
  // Append all form fields to FormData
  Object.keys(productData).forEach(key => {
    formData.append(key, productData[key]);
  });
  
  return api.post("/products", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const login = (loginInfo) => {
  try{
    const res = auth.post("/login", loginInfo);
    return res.data
  }catch (err){
    throw err.response?.data || { error: "Login failed" };
  }
};
// export const getProduct = (id) => api.get(`/products/${id}`);
// export const createProduct = (data) => api.post("/products", data);
// export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
// export const deleteProduct = (id) => api.delete(`/products/${id}`);import axios from "axios"

