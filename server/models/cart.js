const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const addFullImageUrlsToCart = (products) => {
  const baseUrl = process.env.BASE_URL || "http://localhost:8080";

  if (Array.isArray(products)) {
    return products.map((product) => ({
      ...product,
      image_url: product.image_url ? `${baseUrl}${product.image_url}` : null,
    }));
  } else {
    return {
      ...products,
      image_url: products.image_url ? `${baseUrl}${products.image_url}` : null,
    };
  }
};

// Get or create cart for user
const getOrCreateCart = async (userId) => {
  try {
    let cart = await prisma.shopping_carts.findUnique({
      where: {
        user_id: parseInt(userId),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // If cart doesn't exist, create one
    if (!cart) {
      cart = await prisma.shopping_carts.create({
        data: {
          user_id: parseInt(userId),
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    // Add full image URLs to products
    return {
      ...cart,
      items: cart.items.map((item) => ({
        ...item,
        product: addFullImageUrlsToCart(item.product),
      })),
    };
  } catch (error) {
    throw new Error(`Error getting cart: ${error.message}`);
  }
};

// Get cart by user ID
const getCartByUserId = async (userId) => {
  try {
    const cart = await prisma.shopping_carts.findUnique({
      where: {
        user_id: parseInt(userId),
      },
      include: {
        items: {
          include: {
            product: true,
          },
          orderBy: {
            added_at: "desc",
          },
        },
      },
    });

    if (!cart) {
      return null;
    }

    // Add full image URLs and calculate totals
    const cartWithUrls = {
      ...cart,
      items: cart.items.map((item) => ({
        ...item,
        product: addFullImageUrlsToCart(item.product),
        subtotal: parseFloat(item.product.price) * item.quantity,
      })),
    };

    // Calculate cart totals
    const totalItems = cartWithUrls.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartWithUrls.items.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      ...cartWithUrls,
      totalItems,
      totalAmount: totalAmount.toFixed(2),
    };
  } catch (error) {
    throw new Error(`Error fetching cart: ${error.message}`);
  }
};

// Add item to cart
const addItemToCart = async (userId, productId, quantity = 1) => {
  try {
    // Get or create cart
    const cart = await getOrCreateCart(userId);

    // Check if product exists and has sufficient stock
    const product = await prisma.products.findUnique({
      where: { product_id: parseInt(productId) },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock < quantity) {
      throw new Error("Insufficient stock");
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cart_items.findUnique({
      where: {
        cart_id_product_id: {
          cart_id: cart.cart_id,
          product_id: parseInt(productId),
        },
      },
    });

    let cartItem;

    if (existingItem) {
      // Update quantity if item exists
      const newQuantity = existingItem.quantity + parseInt(quantity);

      if (product.stock < newQuantity) {
        throw new Error("Insufficient stock for requested quantity");
      }

      cartItem = await prisma.cart_items.update({
        where: {
          cart_item_id: existingItem.cart_item_id,
        },
        data: {
          quantity: newQuantity,
        },
        include: {
          product: true,
        },
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cart_items.create({
        data: {
          cart_id: cart.cart_id,
          product_id: parseInt(productId),
          quantity: parseInt(quantity),
        },
        include: {
          product: true,
        },
      });
    }

    return {
      ...cartItem,
      product: addFullImageUrlsToCart(cartItem.product),
    };
  } catch (error) {
    throw new Error(`Error adding item to cart: ${error.message}`);
  }
};

// Update cart item quantity
const updateCartItemQuantity = async (cartItemId, quantity) => {
  try {
    const cartItem = await prisma.cart_items.findUnique({
      where: { cart_item_id: parseInt(cartItemId) },
      include: { product: true },
    });

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    if (cartItem.product.stock < quantity) {
      throw new Error("Insufficient stock");
    }

    const updatedItem = await prisma.cart_items.update({
      where: {
        cart_item_id: parseInt(cartItemId),
      },
      data: {
        quantity: parseInt(quantity),
      },
      include: {
        product: true,
      },
    });

    return {
      ...updatedItem,
      product: addFullImageUrlsToCart(updatedItem.product),
    };
  } catch (error) {
    throw new Error(`Error updating cart item: ${error.message}`);
  }
};

// Remove item from cart
const removeItemFromCart = async (cartItemId) => {
  try {
    await prisma.cart_items.delete({
      where: {
        cart_item_id: parseInt(cartItemId),
      },
    });

    return { message: "Item removed from cart successfully" };
  } catch (error) {
    throw new Error(`Error removing item from cart: ${error.message}`);
  }
};

// Clear cart (remove all items)
const clearCart = async (userId) => {
  try {
    const cart = await prisma.shopping_carts.findUnique({
      where: {
        user_id: parseInt(userId),
      },
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    await prisma.cart_items.deleteMany({
      where: {
        cart_id: cart.cart_id,
      },
    });

    return { message: "Cart cleared successfully" };
  } catch (error) {
    throw new Error(`Error clearing cart: ${error.message}`);
  }
};

// Get cart item count for user
const getCartItemCount = async (userId) => {
  try {
    const cart = await prisma.shopping_carts.findUnique({
      where: {
        user_id: parseInt(userId),
      },
      include: {
        items: true,
      },
    });

    if (!cart) {
      return 0;
    }

    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  } catch (error) {
    throw new Error(`Error getting cart item count: ${error.message}`);
  }
};

// Validate cart before checkout
const validateCart = async (userId) => {
  try {
    const cart = await getCartByUserId(userId);

    if (!cart || cart.items.length === 0) {
      return {
        valid: false,
        message: "Cart is empty",
      };
    }

    const invalidItems = [];

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        invalidItems.push({
          product_id: item.product.product_id,
          product_name: item.product.name,
          requested: item.quantity,
          available: item.product.stock,
        });
      }
    }

    if (invalidItems.length > 0) {
      return {
        valid: false,
        message: "Some items have insufficient stock",
        invalidItems,
      };
    }

    return {
      valid: true,
      cart,
    };
  } catch (error) {
    throw new Error(`Error validating cart: ${error.message}`);
  }
};

module.exports = {
  getOrCreateCart,
  getCartByUserId,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart,
  getCartItemCount,
  validateCart,
};
