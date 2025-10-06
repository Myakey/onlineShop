// ==================== FRONTEND API WORKFLOW ====================
// services/cartService.js

import axios from "axios";
import authService from "./authService"; // for logout on refresh fail

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ==================== INTERCEPTORS ====================

// Request interceptor – attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(
            "http://localhost:8080/auth/refresh-token",
            { refreshToken }
          );

          const { accessToken } = response.data;
          localStorage.setItem("accessToken", accessToken);

          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        authService.logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ==================== CART SERVICE ====================

const cartService = {
  // 1. Get cart details
  async getCart() {
    try {
      const response = await api.get("/cart");
      return response.data;
      // { success: true, data: { cart_id, items: [...], totalItems, totalAmount } }
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },

  // 2. Get cart count for badge
  async getCartCount() {
    try {
      const response = await api.get("/cart/count");
      return response.data.data.count;
    } catch (error) {
      console.error("Error fetching cart count:", error);
      return 0;
    }
  },

  // 3. Add product to cart
  async addToCart(productId, quantity = 1) {
    try {
      const response = await api.post("/cart/items", {
        product_id: productId,
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  },

  // 4. Update item quantity
  async updateCartItem(cartItemId, quantity) {
    try {
      const response = await api.put(`/cart/items/${cartItemId}`, { quantity });
      return response.data;
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  },

  // 5. Remove single item
  async removeFromCart(cartItemId) {
    try {
      const response = await api.delete(`/cart/items/${cartItemId}`);
      return response.data;
    } catch (error) {
      console.error("Error removing item from cart:", error);
      throw error;
    }
  },

  // 6. Clear all items
  async clearCart() {
    try {
      const response = await api.delete("/cart/clear");
      return response.data;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  },

  // 7. Validate cart before checkout
  async validateCart(items) {
    try {
      const response = await api.post("/cart/validate", { items });
      return response.data.data;
      // { valid: true/false, message, invalidItems }
    } catch (error) {
      console.error("Error validating cart:", error);
      throw error;
    }
  },
};

export default cartService;
