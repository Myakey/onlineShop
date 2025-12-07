const ReviewModels = require('../models/reviewModel');

class ReviewController {
  // Create a new review
  async createReview(req, res) {
    try {
      const user_id = req.user.id;
      const { product_id, rating, comment } = req.body; // REMOVE: order_id, title, images

      // Validation
      if (!product_id || !rating) {
        return res.status(400).json({
          success: false,
          message: 'Product ID and rating are required',
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5',
        });
      }

      const review = await ReviewModels.createReview({
        user_id,
        product_id: parseInt(product_id),
        rating: parseInt(rating),
        comment, // No title or images
      });

      return res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: review, // No need to parse images
      });
    } catch (error) {
      console.error('Create review error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to create review',
      });
    }
  }

  // Get reviews for a product
  async getProductReviews(req, res) {
    try {
      const { productId } = req.params;
      const { page = 1, limit = 10, rating, sort = 'recent' } = req.query;

      const result = await ReviewModels.getProductReviews(
        parseInt(productId),
        {
          page: parseInt(page),
          limit: parseInt(limit),
          rating,
          sort,
        }
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Get product reviews error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch reviews',
      });
    }
  }

  // Get review statistics for a product
  async getProductReviewStats(req, res) {
    try {
      const { productId } = req.params;

      const stats = await ReviewModels.getProductReviewStats(parseInt(productId));

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Get review stats error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch review statistics',
      });
    }
  }

  // Get user's reviews
  async getUserReviews(req, res) {
    try {
      const user_id = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const result = await ReviewModels.getUserReviews(user_id, {
        page: parseInt(page),
        limit: parseInt(limit),
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Get user reviews error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user reviews',
      });
    }
  }

 // REPLACE updateReview function (line ~120):
  async updateReview(req, res) {
    try {
      const user_id = req.user.id;
      const { reviewId } = req.params;
      const { rating, comment } = req.body;  // REMOVE: title, images

      // Validation
      if (rating && (rating < 1 || rating > 5)) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5',
        });
      }

      const review = await ReviewModels.updateReview(
        parseInt(reviewId),
        user_id,
        { rating: rating ? parseInt(rating) : undefined, comment }  // REMOVE: title, images
      );

      return res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        data: review,
      });
    } catch (error) {
      console.error('Update review error:', error);
      const statusCode = error.message === 'Unauthorized to update this review' ? 403 : 400;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to update review',
      });
    }
  }

  // ADD isAdmin parameter to deleteReview (line ~165):
  async deleteReview(req, res) {
    try {
      const user_id = req.user.id;
      const { reviewId } = req.params;
      const isAdmin = req.user.type === 'admin';  // ADD THIS

      const result = await ReviewModels.deleteReview(parseInt(reviewId), user_id, isAdmin);  // ADD isAdmin

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      console.error('Delete review error:', error);
      const statusCode = error.message === 'Unauthorized to delete this review' ? 403 : 400;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to delete review',
      });
    }
  }

  // REMOVE canUserReview query parameter (line ~185):
  async canUserReview(req, res) {
    try {
      const user_id = req.user.id;
      const { productId } = req.params;
      // REMOVE: orderId query param

      const result = await ReviewModels.canUserReview(
        user_id,
        parseInt(productId)
        // REMOVE: orderId parameter
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Check can review error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to check review eligibility',
      });
    }
  }
}

module.exports = new ReviewController();