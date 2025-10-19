const productModels = require("../models/productsModel");
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
    const { name, description, price, stock } = req.body;

    if (!name || !description || price === undefined || stock === undefined) {
      // If validation fails and file was uploaded, delete it from Cloudinary
      if (req.file && req.file.cloudinary_id) {
        await cleanupFile(req.file.path);
      }
      return res.status(400).json({ message: "All fields are required" });
    }

    // Use Cloudinary URL instead of local path
    const image_url = req.file ? req.file.path : null;

    const newProduct = await productModels.createProduct({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      image_url,
    });

    res.status(201).json(newProduct);
  } catch (err) {
    // Clean up Cloudinary image if product creation fails
    if (req.file && req.file.cloudinary_id) {
      await cleanupFile(req.file.path);
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
