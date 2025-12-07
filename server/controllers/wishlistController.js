const wishlistModel = require("../models/wishlist");

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlist = await wishlistModel.getUserWishlist(userId);

    res.json({
      success: true,
      data: wishlist,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const wishlistItem = await wishlistModel.addToWishlist(userId, product_id);

    res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      data: wishlistItem,
    });
  } catch (err) {
    if (err.message.includes("already in wishlist") || err.message.includes("not found")) {
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

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    await wishlistModel.removeFromWishlist(userId, productId);

    res.json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Check if product is in wishlist
const checkWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const inWishlist = await wishlistModel.isInWishlist(userId, productId);

    res.json({
      success: true,
      data: { inWishlist },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Clear entire wishlist
const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    await wishlistModel.clearWishlist(userId);

    res.json({
      success: true,
      message: "Wishlist cleared successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
  clearWishlist,
};