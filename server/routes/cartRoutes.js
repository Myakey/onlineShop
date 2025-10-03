// routes/cartRoutes.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/authMiddleware'); // Adjust path as needed

// All routes require authentication
router.use(authenticateToken);

// Get user's cart with all items
router.get('/', cartController.getCart);

// Get cart item count (for navbar badge)
router.get('/count', cartController.getCartItemCount);

// Validate cart before checkout
router.get('/validate', cartController.validateCart);

// Add item to cart
router.post('/items', cartController.addItemToCart);

// Update cart item quantity
router.put('/items/:cartItemId', cartController.updateCartItem);

// Remove single item from cart
router.delete('/items/:cartItemId', cartController.removeItemFromCart);

// Clear entire cart
router.delete('/clear', cartController.clearCart);

module.exports = router;

