const productModels = require("../models/productsModel");
const reviewModels = require("../models/reviewModel");
const { cleanupFile } = require("../middleware/uploadImage");

/* =======================
   GET ALL PRODUCTS
======================= */
const getAllProducts = async (req, res) => {
  try {
    const products = await productModels.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =======================
   GET PRODUCT BY ID
======================= */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModels.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =======================
   CREATE PRODUCT
======================= */
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      weight,
      length,
      width,
      height,
    } = req.body;

    if (!name || !description || price === undefined || stock === undefined) {
      if (req.files?.length) {
        for (const file of req.files) {
          await cleanupFile(file.cloudinary_id);
        }
      }
      return res.status(400).json({ message: "All fields are required" });
    }

    const images = req.files
      ? req.files.map((file) => ({
          url: file.path,
          cloudinary_id: file.cloudinary_id,
        }))
      : [];

    const newProduct = await productModels.createProduct({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      weight: parseInt(weight),
      length: parseInt(length),
      width: parseInt(width),
      height: parseInt(height),
      images,
      is_recommended: false, // DEFAULT
    });

    res.status(201).json(newProduct);
  } catch (err) {
    if (req.files?.length) {
      for (const file of req.files) {
        await cleanupFile(file.cloudinary_id);
      }
    }
    res.status(500).json({ message: err.message });
  }
};

/* =======================
   UPDATE PRODUCT
   (SUPPORT is_recommended)
======================= */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      stock,
      is_recommended,
    } = req.body;

    const existingProduct = await productModels.getProductById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔒 CEK REVIEW
    const reviewStats = await reviewModels.getProductReviewStats(id);
    const hasReviews = reviewStats?.total_reviews > 0;

    // Jika produk punya review → hanya boleh update stock, price, is_recommended
    if (hasReviews) {
      const allowedFields = ["stock", "price", "is_recommended"];
      const requestedFields = Object.keys(req.body);

      const invalidFields = requestedFields.filter(
        (field) => !allowedFields.includes(field)
      );

      if (invalidFields.length > 0) {
        return res.status(403).json({
          message:
            "Product with reviews can only update stock, price, or recommendation status",
          invalidFields,
        });
      }
    }

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);

    // ⭐ INI YANG PENTING
    if (is_recommended !== undefined) {
      updateData.is_recommended = Boolean(is_recommended);
    }

    const updatedProduct = await productModels.updateProduct(id, updateData);
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =======================
   DELETE PRODUCT
======================= */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModels.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await productModels.deleteProduct(id);

    if (product.image_url) {
      await cleanupFile(product.image_url);
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =======================
   DELETE PRODUCT IMAGE
======================= */
const deleteProductImage = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModels.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.image_url) {
      return res.status(400).json({ message: "No image to delete" });
    }

    await cleanupFile(product.image_url);

    const updatedProduct = await productModels.updateProduct(id, {
      image_url: null,
    });

    res.json({
      success: true,
      message: "Product image deleted",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =======================
   SEARCH PRODUCT
======================= */
const searchProduct = async (req, res) => {
  try {
    const q = req.query.q?.trim() || "";
    if (!q) {
      const all = await productModels.getAllProducts();
      return res.json(all);
    }

    const products = await productModels.searchProducts(q);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  searchProduct,
};
