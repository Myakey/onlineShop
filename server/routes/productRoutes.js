const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productController");
const {
  uploadMultipleWithErrorHandling,
} = require("../middleware/uploadImage");
const { searchLimiter } = require("../middleware/limiter");

/* =======================
   PRODUCT ROUTES
======================= */

// Get all products
router.get("/", productsController.getAllProducts);

// Search products
router.get("/search", searchLimiter, productsController.searchProduct);

// Get product by ID
router.get("/:id", productsController.getProductById);

// Create product (admin)
router.post(
  "/",
  uploadMultipleWithErrorHandling("image", 5),
  productsController.createProduct
);

// Update product (admin)
router.put(
  "/:id",
  uploadMultipleWithErrorHandling("image", 5),
  productsController.updateProduct
);

// Delete product
router.delete("/:id", productsController.deleteProduct);

// Delete product image
router.delete("/:id/image", productsController.deleteProductImage);

module.exports = router;
