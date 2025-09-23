const productModels = require("../models/productsModels");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await productModels.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Function to add new product (Add any new product from the front-end)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    
    // Basic validation
    if (!name || !description || price === undefined || stock === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const image_url = req.file ? `/uploads/products/${req.file.filename}` : null;

    const newProduct = await productModels.createProduct({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      image_url
    });

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Use your imported model consistently
    await productModels.deleteProduct(id);
    
    res.status(200).json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};