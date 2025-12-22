// reviewRoutes.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken, requireVerifiedUser } = require('../middleware/authMiddleware');
const { reviewLimiter } = require("../middleware/limiter"); 

// Public routes (no auth needed)
router.get('/product/:productId', reviewController.getProductReviews);
router.get('/product/:productId/stats', reviewController.getProductReviewStats);

// Protected routes - ✅ VERIFY EMAIL (prevent fake review spam)
router.post('/', requireVerifiedUser, reviewLimiter, reviewController.createReview);
router.get('/my', requireVerifiedUser, reviewController.getUserReviews);
router.put('/:reviewId', requireVerifiedUser, reviewLimiter, reviewController.updateReview);
router.delete('/:reviewId', requireVerifiedUser, reviewLimiter, reviewController.deleteReview);
router.get('/product/:productId/can-review', requireVerifiedUser, reviewController.canUserReview);

module.exports = router;