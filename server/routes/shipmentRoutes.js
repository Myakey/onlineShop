const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const { shipmentTrackingLimiter } = require("../middleware/limiter");

// Public route
router.get('/track/:trackingNumber', shipmentTrackingLimiter, shipmentController.trackShipment);

// User routes (with ownership check)
router.get('/:id', authenticateToken, shipmentController.getShipmentById);
router.get('/order/:orderId', authenticateToken, shipmentController.getShipmentByOrder);

// Admin routes
router.post('/', authenticateToken, requireAdmin, shipmentController.createShipment);
router.put('/:id/status', authenticateToken, requireAdmin, shipmentController.updateShipmentStatus);
router.put('/order/:orderId', authenticateToken, requireAdmin, shipmentController.updateShipmentByOrder);

module.exports = router;