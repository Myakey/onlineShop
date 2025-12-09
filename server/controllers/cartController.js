const cartModels = require("../models/cartModel");

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await cartModels.getCartByUserId(userId);

    res.json({
      success: true,
      data: cart || { items: [], totalItems: 0, totalAmount: "0.00" },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
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
        message: "Product ID is required",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cartItem = await cartModels.addItemToCart(
      userId,
      product_id,
      quantity
    );

    res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      data: cartItem,
    });
  } catch (err) {
    // Handle specific error messages
    if (err.message.includes("not found") || err.message.includes("stock")) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// REPLACE updateCartItem function (line ~70):
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;  // ADD THIS
    const { productId } = req.params;  // CHANGE from cartItemId
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity is required",
      });
    }

    const updatedItem = await cartModels.updateCartItemQuantity(
      userId,      // ADD userId
      productId,   // CHANGE to productId
      quantity
    );

    res.json({
      success: true,
      message: "Cart item updated successfully",
      data: updatedItem,
    });
  } catch (err) {
    if (err.message.includes("not found") || err.message.includes("stock")) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// REPLACE removeItemFromCart function (line ~105):
const removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user.id;  // ADD THIS
    const { productId } = req.params;  // CHANGE from cartItemId

    const result = await cartModels.removeItemFromCart(userId, productId);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const removeMultipleItems = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have auth middleware
    const { productIds } = req.body;

    console.log(productIds);

    // Validate input
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required and must not be empty'
      });
    }

    const result = await cartModels.removeItemsFromCart(userId, productIds);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Error removing multiple items from cart:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to remove items from cart'
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
      message: result.message,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
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
      data: { count },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Validate cart (before checkout)
const validateCart = async (req, res) => {
  try {
    const userId = req.user.id; //Just for authenticated user so the database won't break
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items provided for validation",
      });
    }

    const validation = await cartModels.validateSelectedItems(items);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
        invalidItems: validation.invalidItems,
      });
    }

    res.json({
      success: true,
      data: validation,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
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
  validateCart,
  removeMultipleItems
};
