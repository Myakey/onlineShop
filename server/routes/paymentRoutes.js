const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const { uploadPaymentProof } = require("../middleware/uploadPaymentProof");
const { uploadPaymentProofLimiter, adminRefundLimiter } = require("../middleware/limiter");

// User routes (with ownership check)
router.get('/:id', authenticateToken, paymentController.getPaymentById);
router.get('/order/:orderId', authenticateToken, paymentController.getPaymentsByOrder);

// ✅ ADD uploadPaymentProof middleware here
router.post('/:id/upload-proof', authenticateToken, uploadPaymentProofLimiter, uploadPaymentProof, paymentController.uploadPaymentProof);

// Admin routes
router.put('/:id/status', authenticateToken, requireAdmin, paymentController.updatePaymentStatus);
router.post('/refund', authenticateToken, requireAdmin, adminRefundLimiter, paymentController.createRefund);
router.get('/refunds/:paymentId', authenticateToken, paymentController.getRefundsByPayment);

module.exports = router;