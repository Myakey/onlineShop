import axios from "axios";
import api from "../services/api";

const productService = {
  async getProducts() {
    const res = await api.get("/products");
    return res.data;
  },
  
  async getProductById(id) {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  
  async createProduct(productData) {
    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });
    const res = await api.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
  
  async updateProduct(id, productData) {
    const res = await api.put(`/products/${id}`, productData, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  },
  
  async searchProduct(searchTerm) {
    const res = await api.get(
      `/products/search?q=${encodeURIComponent(searchTerm)}`
    );
    return res.data;
  },
  
  async deleteProduct(id) {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
};

export default productService;