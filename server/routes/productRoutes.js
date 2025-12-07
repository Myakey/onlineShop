const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productController");
const { upload, uploadWithErrorHandling, uploadMultipleWithErrorHandling } = require("../middleware/uploadImage");

//Ambil semua produk
router.get('/', productsController.getAllProducts);

//Function untuk search di produk
router.get('/search', productsController.searchProduct);

//Ambil produk berdasarkan id
router.get('/:id', productsController.getProductById);

//Buat produk baru (tambahan gambar opsional)
router.post('/', uploadMultipleWithErrorHandling('image', 5), productsController.createProduct);

//Update produk (tambahan gambar opsional)
router.put('/:id', uploadMultipleWithErrorHandling('image', 5), productsController.updateProduct);

//Hapus produk
router.delete('/:id', productsController.deleteProduct);

//Hapus gambar produk
router.delete('/:id/image', productsController.deleteProductImage);

module.exports = router;