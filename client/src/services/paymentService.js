// services/paymentService.js - CREATE THIS NEW FILE

import api from "./api";

const paymentService = {
  // Get payment by ID
  async getPaymentById(paymentId) {
    try {
      const response = await api.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching payment:", error);
      throw error;
    }
  },

  // Get payments by order ID
  async getPaymentsByOrder(orderId) {
    try {
      const response = await api.get(`/payments/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching payments by order:", error);
      throw error;
    }
  },

  // Upload payment proof
  async uploadPaymentProof(paymentId, file) {
    try {
      const formData = new FormData();
      formData.append("paymentProof", file);

      const response = await api.post(`/payments/${paymentId}/upload-proof`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading payment proof:", error);
      throw error;
    }
  },

  // Update payment status (Admin only)
  async updatePaymentStatus(paymentId, status, paidAt = null) {
    try {
      const response = await api.put(`/payments/${paymentId}/status`, {
        payment_status: status,
        paid_at: paidAt,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw error;
    }
  },

  // Create refund (Admin only)
  async createRefund(paymentId, refundAmount, refundReason) {
    try {
      const response = await api.post("/payments/refund", {
        payment_id: paymentId,
        refund_amount: refundAmount,
        refund_reason: refundReason,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating refund:", error);
      throw error;
    }
  },

  // Get refunds by payment ID
  async getRefundsByPayment(paymentId) {
    try {
      const response = await api.get(`/payments/refunds/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching refunds:", error);
      throw error;
    }
  },
};

export default paymentService;