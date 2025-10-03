// ==================== FRONTEND API WORKFLOW ====================
// services/cartService.js - Frontend Service Example

import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Get auth token from localStorage/context
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// ==================== CART OPERATIONS ====================

// 1. GET CART - Display cart page
export const getCart = async () => {
  try {
    const response = await axios.get(`${API_URL}/cart`, getAuthHeaders());
    return response.data;
    // Response: { success: true, data: { cart_id, items: [...], totalItems: 5, totalAmount: "250000.00" } }
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

// 2. GET CART COUNT - For navbar badge
export const getCartCount = async () => {
  try {
    const response = await axios.get(`${API_URL}/cart/count`, getAuthHeaders());
    return response.data.data.count;
    // Response: { success: true, data: { count: 5 } }
  } catch (error) {
    console.error('Error fetching cart count:', error);
    return 0;
  }
};

// 3. ADD TO CART - Product page "Add to Cart" button
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await axios.post(
      `${API_URL}/cart/items`,
      { product_id: productId, quantity },
      getAuthHeaders()
    );
    return response.data;
    // Response: { success: true, message: "Item added to cart successfully", data: {...} }
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

// 4. UPDATE CART ITEM - Change quantity in cart
export const updateCartItem = async (cartItemId, quantity) => {
  try {
    const response = await axios.put(
      `${API_URL}/cart/items/${cartItemId}`,
      { quantity },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

// 5. REMOVE FROM CART - Remove single item
export const removeFromCart = async (cartItemId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/cart/items/${cartItemId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

// 6. CLEAR CART - Remove all items
export const clearCart = async () => {
  try {
    const response = await axios.delete(
      `${API_URL}/cart/clear`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

// 7. VALIDATE CART - Before checkout
export const validateCart = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/cart/validate`,
      getAuthHeaders()
    );
    return response.data.data;
    // Response: { valid: true/false, message: "...", invalidItems: [...] }
  } catch (error) {
    console.error('Error validating cart:', error);
    throw error;
  }
};