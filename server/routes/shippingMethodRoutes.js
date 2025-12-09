// routes/shippingRoutes.js
const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const { shippingRateLimiter } = require("../middleware/limiter");

// Public/User routes
router.get('/methods', shippingController.getAllShippingMethods);
router.get('/methods/:id', shippingController.getShippingMethodById);

// Calculate shipping (requires authentication)
router.post('/calculate', authenticateToken, shippingRateLimiter,shippingController.calculateShippingCost);

// Admin routes
router.post('/methods', authenticateToken, requireAdmin, shippingController.createShippingMethod);
router.put('/methods/:id', authenticateToken, requireAdmin, shippingController.updateShippingMethod);
router.delete('/methods/:id', authenticateToken, requireAdmin, shippingController.deleteShippingMethod);

module.exports = router;