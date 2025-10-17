const ReviewModels = require('../models/reviewModel');

class ReviewController {
  // Create a new review
  async createReview(req, res) {
    try {
      const user_id = req.user.userId;
      const { product_id, order_id, rating, title, comment, images } = req.body;

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
        order_id: order_id ? parseInt(order_id) : null,
        rating: parseInt(rating),
        title,
        comment,
        images,
      });

      return res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: {
          ...review,
          images: review.images ? JSON.parse(review.images) : [],
        },
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
      const user_id = req.user.userId;
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

  // Update a review
  async updateReview(req, res) {
    try {
      const user_id = req.user.userId;
      const { reviewId } = req.params;
      const { rating, title, comment, images } = req.body;

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
        { rating: rating ? parseInt(rating) : undefined, title, comment, images }
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

  // Delete a review
  async deleteReview(req, res) {
    try {
      const user_id = req.user.userId;
      const { reviewId } = req.params;

      const result = await ReviewModels.deleteReview(parseInt(reviewId), user_id);

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

  // Check if user can review a product
  async canUserReview(req, res) {
    try {
      const user_id = req.user.userId;
      const { productId } = req.params;
      const { orderId } = req.query;

      const result = await ReviewModels.canUserReview(
        user_id,
        parseInt(productId),
        orderId ? parseInt(orderId) : null
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