// src/hooks/useReviews.js
import { useState, useEffect, useCallback } from "react";
import reviewService from "../services/reviewService";

/**
 * Custom hook to manage reviews for a specific product.
 * @param {number|string} productId - The product ID to fetch reviews for.
 */
export const useReviews = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all reviews
  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await reviewService.getProductReviews(productId);
      setReviews(res?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // Fetch stats (average rating, count, etc.)
  const fetchStats = useCallback(async () => {
    if (!productId) return;
    try {
      const res = await reviewService.getProductReviewStats(productId);
      setStats(res?.data || null);
    } catch (err) {
      console.error("Error fetching review stats:", err);
    }
  }, [productId]);

  // Create a new review
  const addReview = useCallback(async (reviewData) => {
    try {
      await reviewService.createReview(reviewData);
      await fetchReviews(); // refresh list
      await fetchStats(); // update stats
    } catch (err) {
      throw err;
    }
  }, [fetchReviews, fetchStats]);

  // Update a review
  const updateReview = useCallback(async (reviewId, reviewData) => {
    try {
      await reviewService.updateReview(reviewId, reviewData);
      await fetchReviews();
    } catch (err) {
      throw err;
    }
  }, [fetchReviews]);

  // Delete a review
  const deleteReview = useCallback(async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId);
      await fetchReviews();
      await fetchStats();
    } catch (err) {
      throw err;
    }
  }, [fetchReviews, fetchStats]);

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [fetchReviews, fetchStats]);

  return {
    reviews,
    stats,
    loading,
    error,
    addReview,
    updateReview,
    deleteReview,
    refetch: fetchReviews,
  };
};
