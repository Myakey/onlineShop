const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// User routes (with ownership check)
router.get('/:id', authenticateToken, invoiceController.getInvoiceById);
router.get('/number/:invoiceNumber', authenticateToken, invoiceController.getInvoiceByNumber);
router.get('/order/:orderId', authenticateToken, invoiceController.getInvoicesByOrder);

// Admin routes
router.post('/', authenticateToken, requireAdmin, invoiceController.createInvoice);

module.exports = router;