// routes/cartRoutes.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/authMiddleware'); // Adjust path as needed
const { cartLimiter } = require("../middleware/limiter");

router.use(cartLimiter);

// All routes require authentication
router.use(authenticateToken);

// Get user's cart with all items
router.get('/', cartController.getCart);

// Get cart item count (for navbar badge)
router.get('/count', cartController.getCartItemCount);

// Validate cart before checkout
router.post('/validate', cartController.validateCart);

// Add item to cart
router.post('/items', cartController.addItemToCart);

router.delete('/items/bulk', authenticateToken, cartController.removeMultipleItems);

router.put('/items/:productId', cartController.updateCartItem);

router.delete('/items/:productId', cartController.removeItemFromCart);

// Clear entire cart
router.delete('/clear', cartController.clearCart);

module.exports = router;

