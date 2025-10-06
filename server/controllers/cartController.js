const cartModels = require("../models/cart");

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id; // From authenticated user
    console.log("Fetching cart for user ID:", userId);
    const cart = await cartModels.getOrCreateCart(userId);
    
    res.json({
      success: true,
      data: cart || { items: [], totalItems: 0, totalAmount: "0.00" }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Add item to cart
const addItemToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity = 1 } = req.body;
    
    if (!product_id) {
      return res.status(400).json({ 
        success: false,
        message: "Product ID is required" 
      });
    }
    
    if (quantity < 1) {
      return res.status(400).json({ 
        success: false,
        message: "Quantity must be at least 1" 
      });
    }
    
    const cartItem = await cartModels.addItemToCart(userId, product_id, quantity);
    
    res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      data: cartItem
    });
  } catch (err) {
    // Handle specific error messages
    if (err.message.includes('not found') || err.message.includes('stock')) {
      return res.status(400).json({ 
        success: false,
        message: err.message 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ 
        success: false,
        message: "Valid quantity is required" 
      });
    }
    
    const updatedItem = await cartModels.updateCartItemQuantity(cartItemId, quantity);
    
    res.json({
      success: true,
      message: "Cart item updated successfully",
      data: updatedItem
    });
  } catch (err) {
    if (err.message.includes('not found') || err.message.includes('stock')) {
      return res.status(400).json({ 
        success: false,
        message: err.message 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Remove item from cart
const removeItemFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    
    const result = await cartModels.removeItemFromCart(cartItemId);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await cartModels.clearCart(userId);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Get cart item count (for navbar badge)
const getCartItemCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await cartModels.getCartItemCount(userId);
    
    res.json({
      success: true,
      data: { count }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Validate cart (before checkout)
const validateCart = async (req, res) => {
  try {
    const userId = req.user.id; //Just for authenticated user so the database won't break
    const { items } = req.body;

    console.log("Validating cart items for user ID:", userId, "Items:", items);
    

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "No items provided for validation" 
      });
    }
    
    const validation = await cartModels.validateSelectedItems(items);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
        invalidItems: validation.invalidItems
      });
    }

    res.json({
      success: true,
      data: validation
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
  getCartItemCount,
  validateCart
};