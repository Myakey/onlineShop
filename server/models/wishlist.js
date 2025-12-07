//wishlist.js
const prisma = require("../config/prisma");

const addFullImageUrls = (products) => {
  if (Array.isArray(products)) {
    return products.map((product) => ({
      ...product,
      images: product.images || [],
    }));
  } else {
    return {
      ...products,
      images: products.images || [],
    };
  }
};

// Add product to wishlist
const addToWishlist = async (userId, productId) => {
  try {
    // Check if product exists
    const product = await prisma.products.findUnique({
      where: { product_id: parseInt(productId) },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Check if already in wishlist
    const existing = await prisma.wishlists.findUnique({
      where: {
        user_id_product_id: {
          user_id: parseInt(userId),
          product_id: parseInt(productId),
        },
      },
    });

    if (existing) {
      throw new Error("Product already in wishlist");
    }

    const wishlistItem = await prisma.wishlists.create({
      data: {
        user_id: parseInt(userId),
        product_id: parseInt(productId),
      },
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    });

    return wishlistItem;
  } catch (error) {
    throw new Error(`Error adding to wishlist: ${error.message}`);
  }
};

// Remove product from wishlist
const removeFromWishlist = async (userId, productId) => {
  try {
    await prisma.wishlists.delete({
      where: {
        user_id_product_id: {
          user_id: parseInt(userId),
          product_id: parseInt(productId),
        },
      },
    });

    return { message: "Product removed from wishlist" };
  } catch (error) {
    throw new Error(`Error removing from wishlist: ${error.message}`);
  }
};

// Get user's wishlist
const getUserWishlist = async (userId) => {
  try {
    const wishlist = await prisma.wishlists.findMany({
      where: {
        user_id: parseInt(userId),
      },
      include: {
        product: {
          include: {
            images: {
              where: { is_primary: true },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return wishlist.map((item) => ({
      ...item,
      product: {
        ...item.product,
        primary_image: item.product.images[0]?.image_url || null,
      },
    }));
  } catch (error) {
    throw new Error(`Error fetching wishlist: ${error.message}`);
  }
};

// Check if product is in wishlist
const isInWishlist = async (userId, productId) => {
  try {
    const item = await prisma.wishlists.findUnique({
      where: {
        user_id_product_id: {
          user_id: parseInt(userId),
          product_id: parseInt(productId),
        },
      },
    });

    return !!item;
  } catch (error) {
    throw new Error(`Error checking wishlist: ${error.message}`);
  }
};

// Clear entire wishlist
const clearWishlist = async (userId) => {
  try {
    await prisma.wishlists.deleteMany({
      where: {
        user_id: parseInt(userId),
      },
    });

    return { message: "Wishlist cleared successfully" };
  } catch (error) {
    throw new Error(`Error clearing wishlist: ${error.message}`);
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  isInWishlist,
  clearWishlist,
};