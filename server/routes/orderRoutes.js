// routes/orderRoutes.js

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticateToken, requireAdmin, requireVerifiedUser } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); 
const { orderCreateLimiter, orderCancelLimiter } = require("../middleware/limiter");

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


// ==================== USER ROUTES ====================

// Get user's own orders - ✅ VERIFY EMAIL
router.get("/my-orders", requireVerifiedUser, orderController.getOrdersByUser);

// Get single order by SECURE TOKEN - ✅ VERIFY EMAIL
router.get("/secure/:token", requireVerifiedUser, orderController.getOrderByToken);

// Get order by order number - ✅ VERIFY EMAIL
router.get("/track/:orderNumber", requireVerifiedUser, orderController.getOrderByOrderNumber);

// Create new order - ✅ VERIFY EMAIL (CRITICAL!)
router.post('/', requireVerifiedUser, orderCreateLimiter, orderController.createOrder);

// Cancel order - ✅ VERIFY EMAIL
router.put('/secure/:token/cancel', requireVerifiedUser, orderCancelLimiter, orderController.cancelOrder);

// ==================== ADMIN ROUTES ====================
// (Admin routes already check database via requireAdmin)

router.get("/", requireAdmin, orderController.getAllOrders);
router.get("/admin/:id", requireAdmin, orderController.getOrderById);
router.put("/:id/status", requireAdmin, orderController.updateOrderStatus);
router.put("/admin/:id/cancel", requireAdmin, orderController.cancelOrderById);

module.exports = router;