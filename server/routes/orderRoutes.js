// routes/orderRoutes.js

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); 

const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

// Memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG and WebP are allowed."), false);
  }
};

const uploadMulter = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Helper to upload to Cloudinary
const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: folder },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        Readable.from(buffer).pipe(uploadStream);
    });
};

// Middleware wrapper
const upload = {
    single: (fieldName) => {
        return async (req, res, next) => {
            uploadMulter.single(fieldName)(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }

                if (req.file) {
                    try {
                        const result = await uploadToCloudinary(req.file.buffer, 'uploads/payment_proofs');
                        req.file.path = result.secure_url;
                        req.file.cloudinary_id = result.public_id;
                    } catch (uploadError) {
                        return res.status(500).json({ error: 'Failed to upload payment proof' });
                    }
                }

                next();
            });
        };
    }
};


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

// Cancel order (user can cancel their own pending orders using token)
router.put("/secure/:token/cancel", authenticateToken, orderController.cancelOrder);

// ==================== ADMIN ROUTES (using order IDs) ====================

// Get all orders (admin only)
router.get("/", authenticateToken, requireAdmin, orderController.getAllOrders);

// Get order by ID (admin only)
router.get("/admin/:id", authenticateToken, requireAdmin, orderController.getOrderById);

// Update order status (admin only)
router.put("/:id/status", authenticateToken, requireAdmin, orderController.updateOrderStatus);


// Cancel order by ID (admin only)
router.put("/admin/:id/cancel", authenticateToken, requireAdmin, orderController.cancelOrderById);

module.exports = router;