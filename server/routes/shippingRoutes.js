const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Create a new shipping entry
router.post('/calculate-shipping', authenticateToken, shippingController.calculateShipping);

module.exports = router;