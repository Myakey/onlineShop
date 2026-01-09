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
      weight,
      length,
      width,
      height,
      is_recommended,
      existingImages, // JSON string of cloudinary_ids to keep
    } = req.body;

    const existingProduct = await productModels.getProductById(id);
    if (!existingProduct) {
      // Clean up uploaded files if product not found
      if (req.files?.length) {
        for (const file of req.files) {
          await cleanupFile(file.cloudinary_id);
        }
      }
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
        // Clean up uploaded files
        if (req.files?.length) {
          for (const file of req.files) {
            await cleanupFile(file.cloudinary_id);
          }
        }
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
    if (weight !== undefined) updateData.weight = parseInt(weight);
    if (length !== undefined) updateData.length = parseInt(length);
    if (width !== undefined) updateData.width = parseInt(width);
    if (height !== undefined) updateData.height = parseInt(height);

    // ⭐ Handle is_recommended
    if (is_recommended !== undefined) {
      updateData.is_recommended = Boolean(is_recommended);
    }

    // 🖼️ Handle Images
    // 🖼️ Handle Images
let finalImages = [];

console.log("Received existingImages:", existingImages);

// Parse existing images to keep (these are product_img_ids)
if (existingImages) {
  try {
    const existingIds = JSON.parse(existingImages); // Array of product_img_ids
    console.log("Parsed IDs:", existingIds);
    console.log("Existing product images:", existingProduct.images.map(img => img.product_img_id));
    
    finalImages = existingProduct.images.filter(img => 
      existingIds.includes(img.product_img_id)  // ✅ Use product_img_id
    ).map(img => ({
      product_img_id: img.product_img_id,  // Include the ID
      url: img.image_url,
    }));

    console.log("Final images to keep:", finalImages);

    // Clean up removed images
    const removedImages = existingProduct.images.filter(img => 
      !existingIds.includes(img.product_img_id)
    );
    
    console.log("Images to remove:", removedImages);
    
    for (const img of removedImages) {
      await cleanupFile(img.image_url);
    }
  } catch (err) {
    console.error("Error parsing existingImages:", err);
  }
}

    // Add new uploaded images
    if (req.files?.length) {
      const newImages = req.files.map((file) => ({
        url: file.path,
        cloudinary_id: file.cloudinary_id,
      }));
      console.log(newImages);
      finalImages = [...finalImages, ...newImages];
    }

    // Limit to 5 images
    if (finalImages.length > 5) {
      finalImages = finalImages.slice(0, 5);
    }

    updateData.images = finalImages;

    const updatedProduct = await productModels.updateProduct(id, updateData);
    res.json(updatedProduct);
  } catch (err) {
    // Clean up uploaded files on error
    if (req.files?.length) {
      for (const file of req.files) {
        await cleanupFile(file.cloudinary_id);
      }
    }
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
