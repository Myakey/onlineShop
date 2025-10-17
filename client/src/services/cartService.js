import api from "../services/api"

//backend blm ada /api

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
