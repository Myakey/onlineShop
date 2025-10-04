// import { PrismaClient } from "@prisma/client";

// const productModels = require("../models/productsModels");
// const fs = require("fs");
// const path = require("path");
// const prisma = new PrismaClient();

// // Helper function to delete image file
// const deleteImageFile = (imagePath) => {
//   if (imagePath) {
//     // Remove the base URL part to get the actual file path
//     const relativePath = imagePath.replace(process.env.BASE_URL || 'http://localhost:8080', '');
//     const fullPath = path.join(__dirname, '..', relativePath);
    
//     if (fs.existsSync(fullPath)) {
//       fs.unlinkSync(fullPath);
//       // console.log(`Deleted image: ${fullPath}`);
//     }
//   }
// };

// exports.getAllProducts = async (req, res) => {
//   try {
//     const products = await productModels.getAllProducts();
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await productModels.getProductById(id);
    
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
    
//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.createProduct = async (req, res) => {
//   try {
//     const { name, description, price, stock } = req.body;
    
//     // Basic validation
//     if (!name || !description || price === undefined || stock === undefined) {
//       // If validation fails and file was uploaded, delete it
//       if (req.file) {
//         fs.unlinkSync(req.file.path);
//       }
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     const image_url = req.file ? `/uploads/products/${req.file.filename}` : null;

//     const newProduct = await productModels.createProduct({
//       name,
//       description,
//       price: parseFloat(price),
//       stock: parseInt(stock),
//       image_url
//     });

//     res.status(201).json(newProduct);
//   } catch (err) {
//     // If product creation fails and file was uploaded, delete it
//     if (req.file) {
//       fs.unlinkSync(req.file.path);
//     }
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, description, price, stock } = req.body;
    
//     // Get the existing product to check for old image
//     const existingProduct = await productModels.getProductById(id);
//     if (!existingProduct) {
//       // If product doesn't exist and file was uploaded, delete it
//       if (req.file) {
//         fs.unlinkSync(req.file.path);
//       }
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Prepare update data
//     const updateData = {};
//     if (name !== undefined) updateData.name = name;
//     if (description !== undefined) updateData.description = description;
//     if (price !== undefined) updateData.price = parseFloat(price);
//     if (stock !== undefined) updateData.stock = parseInt(stock);

//     // Handle image update
//     if (req.file) {
//       // Delete old image if it exists
//       if (existingProduct.image_url) {
//         deleteImageFile(existingProduct.image_url);
//       }
      
//       // Set new image URL
//       updateData.image_url = `/uploads/products/${req.file.filename}`;
//     }

//     const updatedProduct = await productModels.updateProduct(id, updateData);
//     res.json(updatedProduct);
//   } catch (err) {
//     // If update fails and file was uploaded, delete it
//     if (req.file) {
//       fs.unlinkSync(req.file.path);
//     }
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Get the product to find the image path before deleting
//     const product = await productModels.getProductById(id);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Delete the product from database
//     const deleted = await productModels.deleteProduct(id);
    
//     if (deleted) {
//       // Delete the image file if it exists
//       if (product.image_url) {
//         deleteImageFile(product.image_url);
//       }
      
//       res.status(200).json({ 
//         success: true, 
//         message: 'Product and image deleted successfully' 
//       });
//     } else {
//       res.status(404).json({ message: 'Product not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // New endpoint to delete only the product image (keep product)
// exports.deleteProductImage = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const product = await productModels.getProductById(id);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     if (!product.image_url) {
//       return res.status(400).json({ message: 'Product has no image to delete' });
//     }

//     // Delete the image file
//     deleteImageFile(product.image_url);

//     // Update product to remove image URL
//     const updatedProduct = await productModels.updateProduct(id, { image_url: null });
    
//     res.json({ 
//       success: true, 
//       message: 'Product image deleted successfully',
//       product: updatedProduct 
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const searchProduct = async(req, res)=>{
//     try {
//       const q = req.query.q?.toString() || ""
//       const products = await prisma.products.findMany({
//         where:{
//           name: {
//             contains: q,
//             mode: "insensitive",
//           },
//         },
//       })
//       res.json(products)
//     } catch (error){
//       res.status(500)
//     }
// }

const { PrismaClient } = require("@prisma/client");
const productModels = require("../models/productsModels");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

// Helper function to delete image file
const deleteImageFile = (imagePath) => {
  if (imagePath) {
    const relativePath = imagePath.replace(process.env.BASE_URL || "http://localhost:8080", "");
    const fullPath = path.join(__dirname, "..", relativePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
};

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
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "All fields are required" });
    }

    const image_url = req.file ? `/uploads/products/${req.file.filename}` : null;

    const newProduct = await productModels.createProduct({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      image_url,
    });

    res.status(201).json(newProduct);
  } catch (err) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
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
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: "Product not found" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);

    if (req.file) {
      if (existingProduct.image_url) {
        deleteImageFile(existingProduct.image_url);
      }
      updateData.image_url = `/uploads/products/${req.file.filename}`;
    }

    const updatedProduct = await productModels.updateProduct(id, updateData);
    res.json(updatedProduct);
  } catch (err) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
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
      if (product.image_url) {
        deleteImageFile(product.image_url);
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

    deleteImageFile(product.image_url);

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
    const q = req.query.q?.toString() || "";
    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
