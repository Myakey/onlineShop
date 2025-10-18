// routes/orderRoutes.js

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); 

// Configure multer for payment proof uploads
const uploadDirectory = "uploads/payment_proofs/";
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/payment_proofs/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "payment-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG and WebP are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// ==================== USER ROUTES (using secure tokens) ====================

// Get user's own orders
router.get("/my-orders", authenticateToken, orderController.getOrdersByUser);

// Get single order by SECURE TOKEN (primary method for users)
router.get("/secure/:token", authenticateToken, orderController.getOrderByToken);

// Get order by order number (for tracking)
router.get("/track/:orderNumber", authenticateToken, orderController.getOrderByOrderNumber);

// Create new order (checkout)
router.post("/", authenticateToken, orderController.createOrder);

// Upload payment proof (using secure token)
router.post(
  "/secure/:token/payment-proof",
  authenticateToken,
  upload.single("paymentProof"),
  orderController.uploadPaymentProof
);

// Cancel order (user can cancel their own pending orders using token)
router.put("/secure/:token/cancel", authenticateToken, orderController.cancelOrder);

// ==================== ADMIN ROUTES (using order IDs) ====================

// Get all orders (admin only)
router.get("/", authenticateToken, requireAdmin, orderController.getAllOrders);

// Get order by ID (admin only)
router.get("/admin/:id", authenticateToken, requireAdmin, orderController.getOrderById);

// Update order status (admin only)
router.put("/:id/status", authenticateToken, requireAdmin, orderController.updateOrderStatus);

// Update payment status (admin only)
router.put("/:id/payment-status", authenticateToken, requireAdmin, orderController.updatePaymentStatus);

// Cancel order by ID (admin only)
router.put("/admin/:id/cancel", authenticateToken, requireAdmin, orderController.cancelOrderById);

module.exports = router;