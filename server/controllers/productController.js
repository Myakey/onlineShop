const productModels = require("../models/productsModel");
const reviewModels = require("../models/reviewModel");
const { cleanupFile } = require("../middleware/uploadImage");

const getAllProducts = async (req, res) => {
  try { 
    const products = await productModels.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, weight, length, width, height } = req.body;

    if (!name || !description || price === undefined || stock === undefined) {
      // Cleanup uploaded files if validation fails
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          await cleanupFile(file.cloudinary_id);
        }
      }

      return res.status(400).json({ message: "All fields are required" });
    }

    // Prepare image array for model
    const images = req.files
      ? req.files.map(file => ({
          url: file.path,
          cloudinary_id: file.cloudinary_id
        }))
      : [];

    const newProduct = await productModels.createProduct({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      weight: parseInt(weight),
      length : parseInt(length),
      width: parseInt(width),
      height: parseInt(height),
      images
    });

    res.status(201).json(newProduct);

  } catch (err) {
    // Cleanup Cloudinary if product creation fails
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await cleanupFile(file.cloudinary_id);
      }
    }

    res.status(500).json({ message: err.message });
  }
};


const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    const existingProduct = await productModels.getProductById(id);
    if (!existingProduct) {
      if (req.file && req.file.cloudinary_id) {
        await cleanupFile(req.file.path);
      }
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if product has reviews
    const hasReviews = (await reviewModels.getProductReviewStats(id)).total_reviews;
    
    if (hasReviews) {
      // Clean up uploaded file if any
      if (req.file && req.file.cloudinary_id) {
        await cleanupFile(req.file.path);
      }
      
      // Option 1: Completely prevent updates
      return res.status(403).json({ 
        message: "Cannot update product that has reviews. This prevents fraudulent changes to reviewed products." 
      });
      
      // Option 2: Allow only specific fields (stock and price)
      // Uncomment this section if you want to allow limited updates
      /*
      const allowedFields = ['stock', 'price'];
      const requestedFields = Object.keys(req.body);
      const restrictedFields = requestedFields.filter(
        field => !allowedFields.includes(field) && req.body[field] !== undefined
      );
      
      if (restrictedFields.length > 0 || req.file) {
        return res.status(403).json({ 
          message: `Cannot update ${restrictedFields.join(', ')} or image for products with reviews. Only stock and price updates are allowed.`,
          restrictedFields
        });
      }
      */
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);

    if (req.file) {
      // Delete old image from Cloudinary
      if (existingProduct.image_url) {
        await cleanupFile(existingProduct.image_url);
      }
      // Use new Cloudinary URL
      updateData.image_url = req.file.path;
    }

    const updatedProduct = await productModels.updateProduct(id, updateData);
    res.json(updatedProduct);
  } catch (err) {
    if (req.file && req.file.cloudinary_id) {
      await cleanupFile(req.file.path);
    }
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModels.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const deleted = await productModels.deleteProduct(id);

    if (deleted) {
      // Delete image from Cloudinary
      if (product.image_url) {
        await cleanupFile(product.image_url);
      }

      res.status(200).json({
        success: true,
        message: "Product and image deleted successfully",
      });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProductImage = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModels.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.image_url) {
      return res.status(400).json({ message: "Product has no image to delete" });
    }

    // Delete from Cloudinary
    await cleanupFile(product.image_url);

    const updatedProduct = await productModels.updateProduct(id, { image_url: null });

    res.json({
      success: true,
      message: "Product image deleted successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchProduct = async (req, res) => {
  try {
    const q = req.query.q?.trim() || "";

    if (!q) {
      const all = await productModels.getAllProducts();
      return res.json(all);
    }

    const searchTerm = q;

    const products = await productModels.searchProducts(searchTerm);

    res.json(products);
  } catch (error) {
    console.error(error);
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
