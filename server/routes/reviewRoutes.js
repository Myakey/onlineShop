// reviewRoutes.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { reviewLimiter } = require("../middleware/limiter"); 

// 🟢 Now routes are relative to /api/reviews
router.get('/product/:productId', reviewController.getProductReviews);
router.get('/product/:productId/stats', reviewController.getProductReviewStats);

router.post('/', authenticateToken, reviewLimiter, reviewController.createReview);
router.get('/my', authenticateToken, reviewController.getUserReviews);
router.put('/:reviewId', authenticateToken, reviewLimiter, reviewController.updateReview);
router.delete('/:reviewId', authenticateToken, reviewLimiter, reviewController.deleteReview);
router.get('/product/:productId/can-review', authenticateToken, reviewController.canUserReview);

module.exports = router;
