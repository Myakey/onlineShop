//Cart Model
const prisma = require("../config/prisma")

const addFullImageUrlsToCart = (products) => {
  // Cloudinary URLs are already complete, just return as-is
  if (Array.isArray(products)) {
    return products.map((product) => ({
      ...product,
      image_url: product.image_url || null,
    }));
  } else {
    return {
      ...products,
      image_url: products.image_url || null,
    };
  }
};

// Get cart by user ID
const getCartByUserId = async (userId) => {
  try {
    const items = await prisma.cart_items.findMany({
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
        added_at: "desc",
      },
    });

    if (items.length === 0) {
      return null;
    }

    // Calculate totals
    const cartWithTotals = items.map((item) => ({
      ...item,
      product: addFullImageUrlsToCart(item.product),
      subtotal: parseFloat(item.product.price) * item.quantity,
    }));

    const totalItems = cartWithTotals.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartWithTotals.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      items: cartWithTotals,
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
        user_id_product_id: {
          user_id: parseInt(userId),
          product_id: parseInt(productId),
        },
      },
    });

    let cartItem;

    if (existingItem) {
      const newQuantity = existingItem.quantity + parseInt(quantity);

      if (product.stock < newQuantity) {
        throw new Error("Insufficient stock for requested quantity");
      }

      cartItem = await prisma.cart_items.update({
        where: {
          user_id_product_id: {
            user_id: parseInt(userId),
            product_id: parseInt(productId),
          },
        },
        data: {
          quantity: newQuantity,
        },
        include: {
          product: true,
        },
      });
    } else {
      cartItem = await prisma.cart_items.create({
        data: {
          user_id: parseInt(userId),
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
const updateCartItemQuantity = async (userId, productId, quantity) => {
  try {
    const cartItem = await prisma.cart_items.findUnique({
      where: {
        user_id_product_id: {
          user_id: parseInt(userId),
          product_id: parseInt(productId),
        },
      },
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
        user_id_product_id: {
          user_id: parseInt(userId),
          product_id: parseInt(productId),
        },
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
const removeItemFromCart = async (userId, productId) => {
  try {
    console.log(productId);
    await prisma.cart_items.delete({
      where: {
        user_id_product_id: {
          user_id: parseInt(userId),
          product_id: parseInt(productId),
        },
      },
    });

    return { message: "Item removed from cart successfully" };
  } catch (error) {
    throw new Error(`Error removing item from cart: ${error.message}`);
  }
};

// Remove multiple items from cart
const removeItemsFromCart = async (userId, productIds) => {
  try {
    if (!Array.isArray(productIds) || productIds.length === 0) {
      throw new Error("Product IDs array is required");
    }

    console.log(productIds)

    await prisma.cart_items.deleteMany({
      where: {
        user_id: parseInt(userId),
        product_id: {
          in: productIds.map(id => parseInt(id))
        }
      },
    });

    return { message: "Items removed from cart successfully" };
  } catch (error) {
    throw new Error(`Error removing items from cart: ${error.message}`);
  }
};

// Clear cart (remove all items)
const clearCart = async (userId) => {
  try {
    await prisma.cart_items.deleteMany({
      where: {
        user_id: parseInt(userId),
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
    const items = await prisma.cart_items.findMany({
      where: {
        user_id: parseInt(userId),
      },
    });

    return items.reduce((sum, item) => sum + item.quantity, 0);
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

const validateSelectedItems = async (itemsToValidate) => {
  try {
    const invalidItems = [];
    const productIds = itemsToValidate.map(item => parseInt(item.product_id));

    
    // Fetch current stock for all requested product IDs
    const products = await prisma.products.findMany({
      where: { product_id: { in: productIds } },
      select: { product_id: true, name: true, stock: true }
    });

    const productMap = new Map(products.map(p => [p.product_id, p]));

    // Check requested quantities against current stock
    for (const item of itemsToValidate) {
      const productId = parseInt(item.product_id);
      const requestedQuantity = parseInt(item.quantity);
      const product = productMap.get(productId);

      if (!product || product.stock < requestedQuantity) {
        // Find the product name or use a default if not found
        const productName = product ? product.name : `Product ID ${productId}`;
        
        invalidItems.push({
          product_id: productId,
          product_name: productName,
          requested: requestedQuantity,
          available: product ? product.stock : 0
        });
      }
    }

    if (invalidItems.length > 0) {
      return {
        valid: false,
        message: 'Some selected items have insufficient stock',
        invalidItems
      };
    }

    return {
      valid: true,
      message: 'All selected items are in stock.'
    };
  } catch (error) {
    throw new Error(`Error validating selected cart items: ${error.message}`);
  }
};

module.exports = {
  getCartByUserId,
  addItemToCart,
  updateCartItemQuantity,
  // removeItemFromCart,
  clearCart,
  getCartItemCount,
  validateCart,
  validateSelectedItems,
  removeItemsFromCart
};
