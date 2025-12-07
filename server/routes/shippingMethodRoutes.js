const express = require('express');
const router = express.Router();
const shippingMethodsController = require('../controllers/shippingController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const { calculateShippingCost } = require("../services/shippingService");

router.get('/coba', calculateShippingCost)

// Public routes
router.get('/', shippingMethodsController.getAllShippingMethods);
router.get('/:id', shippingMethodsController.getShippingMethodById);

// Admin routes
router.post('/', authenticateToken, requireAdmin, shippingMethodsController.createShippingMethod);
router.put('/:id', authenticateToken, requireAdmin, shippingMethodsController.updateShippingMethod);
router.delete('/:id', authenticateToken, requireAdmin, shippingMethodsController.deleteShippingMethod);


module.exports = router;