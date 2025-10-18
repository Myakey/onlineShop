// src/services/reviewService.js
import api from "./api";

const reviewService = {
  // Get all reviews for a specific product
  async getProductReviews(productId, { page = 1, limit = 10, rating, sort = "recent" } = {}) {
    const params = { page, limit };
    if (rating) params.rating = rating;
    if (sort) params.sort = sort;
    
    const response = await api.get(`/reviews/product/${productId}`, { params });
    return response.data;
  },

  // Get review statistics
  async getProductReviewStats(productId) {
    const response = await api.get(`/reviews/product/${productId}/stats`);
    return response.data;
  },

  // Create a new review
  async createReview(reviewData) {
    const response = await api.post("/reviews", reviewData);
    return response.data;
  },

  // Get current user's reviews
  async getUserReviews({ page = 1, limit = 10 } = {}) {
    const params = { page, limit };
    const response = await api.get("/reviews/my", { params });
    return response.data;
  },

  // Update a review
  async updateReview(reviewId, updatedData) {
    const response = await api.put(`/reviews/${reviewId}`, updatedData);
    return response.data;
  },

  // Delete a review
  async deleteReview(reviewId) {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  // Check if user can review
  async canUserReview(productId, orderId = null) {
    const params = orderId ? { orderId } : {};
    const response = await api.get(`/reviews/product/${productId}/can-review`, { params });
    return response.data;
  },

  // Get reviews by user (public) - if you have this route
  async getReviewsByUser(userId, { page = 1, limit = 10 } = {}) {
    const params = { page, limit };
    const response = await api.get(`/reviews/user/${userId}`, { params });
    return response.data;
  },

  // Get bulk review summaries - if you have this route
  async getProductsReviewSummary(productIds) {
    const response = await api.post("/reviews/summary", { productIds });
    return response.data;
  },
};

export default reviewService;