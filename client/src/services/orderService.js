// services/orderService.js
import api from "./api";

// Helper function for cleaner error logging
const handleError = (error, message) => {
  console.error(`${message}:`, error.response?.data || error.message || error);
  throw error;
};

// ==================== USER ORDER OPERATIONS (using secure tokens) ====================

// 1. CREATE ORDER - Checkout from cart
export const createOrder = async (orderData) => {
  try {
    const res = await api.post("/orders", orderData);
    return res.data;
  } catch (err) {
    handleError(err, "Error creating order");
  }
};

// 2. GET USER'S ORDERS - Order history page
export const getMyOrders = async () => {
  try {
    const res = await api.get("/orders/my-orders");
    return res.data;
  } catch (err) {
    handleError(err, "Error fetching user's orders");
  }
};

// 3. GET ORDER BY SECURE TOKEN - Order detail page (PRIMARY METHOD)
export const getOrderByToken = async (secureToken) => {
  try {
    const res = await api.get(`/orders/secure/${secureToken}`);
    return res.data;
  } catch (err) {
    handleError(err, "Error fetching order by token");
  }
};

// 4. GET ORDER BY ORDER NUMBER - Track order
export const trackOrder = async (orderNumber) => {
  try {
    const res = await api.get(`/orders/track/${orderNumber}`);
    return res.data;
  } catch (err) {
    handleError(err, "Error tracking order");
  }
};

// 5. UPLOAD PAYMENT PROOF - Payment page (using secure token)
export const uploadPaymentProof = async (secureToken, file) => {
  try {
    const formData = new FormData();
    formData.append("paymentProof", file);

    const res = await api.post(`/orders/secure/${secureToken}/payment-proof`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (err) {
    handleError(err, "Error uploading payment proof");
  }
};

// 6. CANCEL ORDER - User can cancel pending orders (using secure token)
export const cancelOrder = async (secureToken) => {
  try {
    const res = await api.put(`/orders/secure/${secureToken}/cancel`, {});
    return res.data;
  } catch (err) {
    handleError(err, "Error cancelling order");
  }
};

// ==================== ADMIN OPERATIONS (using order IDs) ====================

// 7. GET ALL ORDERS (Admin only)
export const getAllOrders = async () => {
  try {
    const res = await api.get("/orders");
    return res.data;
  } catch (err) {
    handleError(err, "Error fetching all orders");
  }
};

// 8. GET ORDER BY ID (Admin only)
export const getOrderById = async (orderId) => {
  try {
    const res = await api.get(`/orders/admin/${orderId}`);
    return res.data;
  } catch (err) {
    handleError(err, "Error fetching order by ID");
  }
};

// 9. UPDATE ORDER STATUS (Admin only)
export const updateOrderStatus = async (orderId, status) => {
  try {
    const res = await api.put(`/orders/${orderId}/status`, { status });
    return res.data;
  } catch (err) {
    handleError(err, "Error updating order status");
  }
};

// 10. UPDATE PAYMENT STATUS (Admin only)
export const updatePaymentStatus = async (orderId, paymentStatus, paymentMethod = null) => {
  try {
    const res = await api.put(`/orders/${orderId}/payment-status`, {
      payment_status: paymentStatus,
      payment_method: paymentMethod,
    });
    return res.data;
  } catch (err) {
    handleError(err, "Error updating payment status");
  }
};

// 11. CANCEL ORDER BY ID (Admin only)
export const cancelOrderById = async (orderId) => {
  try {
    const res = await api.put(`/orders/admin/${orderId}/cancel`, {});
    return res.data;
  } catch (err) {
    handleError(err, "Error cancelling order");
  }
};

// Default export for cleaner imports
export default {
  // User operations (use secure tokens)
  createOrder,
  getMyOrders,
  getOrderByToken,
  trackOrder,
  uploadPaymentProof,
  cancelOrder,
  
  // Admin operations (use order IDs)
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrderById,
};