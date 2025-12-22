const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken, requireAdmin, requireVerifiedUser } = require('../middleware/authMiddleware');
const { uploadPaymentProof } = require("../middleware/uploadPaymentProof");
const { uploadPaymentProofLimiter, adminRefundLimiter } = require("../middleware/limiter");

// User routes - ✅ VERIFY EMAIL
router.get('/:id', requireVerifiedUser, paymentController.getPaymentById);
router.get('/order/:orderId', requireVerifiedUser, paymentController.getPaymentsByOrder);
router.post('/:id/upload-proof', requireVerifiedUser, uploadPaymentProofLimiter, uploadPaymentProof, paymentController.uploadPaymentProof);

// Admin routes (already protected)
router.put('/:id/status', requireAdmin, paymentController.updatePaymentStatus);
router.post('/refund', requireAdmin, adminRefundLimiter, paymentController.createRefund);

module.exports = router;