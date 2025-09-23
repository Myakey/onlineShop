const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsControllers");
const upload = require("../middleware/uploadImage");

router.get('/', productsController.getAllProducts);
router.post('/', upload.single('image'), productsController.createProduct); 
router.delete('/:id', productsController.deleteProduct);

module.exports = router;