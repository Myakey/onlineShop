const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productController");
const { upload, uploadWithErrorHandling } = require("../middleware/uploadImage");

// Get all products
router.get('/', productsController.getAllProducts);

// Search product
router.get('/search', productsController.searchProduct);

// Get product by ID
router.get('/:id', productsController.getProductById);

// Create new product (with optional image upload)
router.post('/', uploadWithErrorHandling('image'), productsController.createProduct);
//                                        ^^^^^^^^ ADD THIS!

// Update product (with optional image upload)
router.put('/:id', uploadWithErrorHandling('image'), productsController.updateProduct);
//                                         ^^^^^^^^ ADD THIS!

// Delete product (and its image)
router.delete('/:id', productsController.deleteProduct);

// Delete only product image (keep product)
router.delete('/:id/image', productsController.deleteProductImage);

module.exports = router;