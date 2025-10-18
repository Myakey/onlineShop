import axios from "axios";
import api from "../services/api";

const productService = {
  async getProducts() {
    const res = await api.get("/products");
    return res;
  },

  async getProductById(id){
    const res = await api.get(`/products/${id}`);
    
  },

  async createProduct(productData) {
    const formData = new FormData();

    // Append all form fields to FormData
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });

    return await api.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  async searchProduct(searchTerm) {
    const res = await api.get(`/products/search?q=${encodeURIComponent(searchTerm)}`);
    return res;
  },

  async deleteProduct(id) {
    const res = await api.delete(`/products/${id}`);
    return res;
  },
};

export const getProducts = () => api.get("/products");

export const createProduct = (productData) => {
  const formData = new FormData();

  // Append all form fields to FormData
  Object.keys(productData).forEach((key) => {
    formData.append(key, productData[key]);
  });

  return api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const searchProduct = async (searchTerm) => {
  const res = api.get(`/products/search?q=${encodeURIComponent(searchTerm)}`);
  return res;
};

export const deleteProduct = (id) => api.delete(`/products/${id}`);

export default productService;
