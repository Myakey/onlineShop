// models/orderModel.js
const crypto = require("crypto");
const prisma = require("../config/prisma");

const addFullImageUrls = (products) => {
  // Cloudinary URLs are already complete, just return as-is
  if (Array.isArray(products)) {
    return products.map(product => ({
      ...product,
      image_url: product.image_url || null
    }));
  } else {
    return {
      ...products,
      image_url: products.image_url || null
    };
  }
};

// Generate secure random token for URL with collision checking
const generateSecureToken = async () => {
  const maxRetries = 10;
  
  for (let i = 0; i < maxRetries; i++) {
    const token = crypto.randomBytes(32).toString('hex');
    
    const existingOrder = await prisma.orders.findUnique({
      where: { secure_token: token },
      select: { order_id: true }
    });
    
    if (!existingOrder) {
      return token;
    }
    
    console.warn(`Token collision detected (attempt ${i + 1}/${maxRetries}), generating new token...`);
  }
  
  throw new Error('Failed to generate unique secure token after multiple attempts');
};

// Get all orders (admin)
const getAllOrders = async () => {
  try {
    const orders = await prisma.orders.findMany({
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            email: true,
            first_name: true,
            last_name: true,
            phone_number: true
          }
        },
        address: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    
    return orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        product: addFullImageUrls(item.product)
      }))
    }));
  } catch (error) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }
};

// Get orders by user ID
const getOrdersByUser = async (userId) => {
  try {
    const orders = await prisma.orders.findMany({
      where: {
        user_id: parseInt(userId)
      },
      include: {
        address: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    if (!orders || orders.length === 0) {
      return [];
    }
    
    return orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        product: addFullImageUrls(item.product)
      }))
    }));
  } catch (error) {
    throw new Error(`Error fetching user orders: ${error.message}`);
  }
};

// Get single order by secure token (NEW - PRIMARY USER METHOD)
const getOrderByToken = async (secureToken) => {
  try {
    const order = await prisma.orders.findUnique({
      where: {
        secure_token: secureToken
      },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            email: true,
            first_name: true,
            last_name: true,
            phone_number: true
          }
        },
        address: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return null;
    }

    return {
      ...order,
      items: order.items.map(item => ({
        ...item,
        product: addFullImageUrls(item.product)
      }))
    };
  } catch (error) {
    throw new Error(`Error fetching order by token: ${error.message}`);
  }
};

// Get single order by ID (keep for admin use)
const getOrderById = async (orderId) => {
  try {
    const order = await prisma.orders.findUnique({
      where: {
        order_id: parseInt(orderId)
      },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            email: true,
            first_name: true,
            last_name: true,
            phone_number: true
          }
        },
        address: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return null;
    }

    return {
      ...order,
      items: order.items.map(item => ({
        ...item,
        product: addFullImageUrls(item.product)
      }))
    };
  } catch (error) {
    throw new Error(`Error fetching order: ${error.message}`);
  }
};

// Get order by order number
const getOrderByOrderNumber = async (orderNumber) => {
  try {
    const order = await prisma.orders.findUnique({
      where: {
        order_number: orderNumber
      },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            email: true,
            first_name: true,
            last_name: true,
            phone_number: true
          }
        },
        address: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return null;
    }

    return {
      ...order,
      items: order.items.map(item => ({
        ...item,
        product: addFullImageUrls(item.product)
      }))
    };
  } catch (error) {
    throw new Error(`Error fetching order by number: ${error.message}`);
  }
};

// Create new order with items
// Create new order with items
const createOrder = async (orderData) => {
  try {
    const { 
      user_id, 
      address_id, 
      order_number, 
      status = 'pending', 
      notes = null,
      promocode_id = null,
      shipping_method_id = null,
      items = [],
      decrementStock = false
    } = orderData;

    const secureToken = await generateSecureToken();

    // Validate stock availability OUTSIDE transaction
    if (items.length > 0) {
      for (const item of items) {
        const product = await prisma.products.findUnique({
          where: { product_id: parseInt(item.product_id) }
        });

        if (!product) {
          throw new Error(`Product with ID ${item.product_id} not found`);
        }

        if (product.stock < parseInt(item.quantity)) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
        }
      }
    }

    // Transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.orders.create({
        data: {
          user_id: parseInt(user_id),
          address_id: parseInt(address_id),
          order_number,
          secure_token: secureToken,
          status,
          notes,
          promocode_id: promocode_id ? parseInt(promocode_id) : null,
          shipping_method_id: shipping_method_id ? parseInt(shipping_method_id) : null,
        }
      });

      // Create order items if provided
      if (items.length > 0) {
        const orderItems = items.map(item => ({
          order_id: order.order_id,
          product_id: parseInt(item.product_id),
          quantity: parseInt(item.quantity),
          price: item.price,
          subtotal: item.price * item.quantity
        }));

        await tx.order_items.createMany({
          data: orderItems
        });

        if (decrementStock) {
          for (const item of items) {
            await tx.products.update({
              where: { product_id: parseInt(item.product_id) },
              data: {
                stock: {
                  decrement: parseInt(item.quantity)
                }
              }
            });
          }
        }
      }

      return order;
    }, {
      maxWait: 5000,
      timeout: 10000,
    });

    // Fetch complete order OUTSIDE transaction
    const completeOrder = await prisma.orders.findUnique({
      where: { order_id: newOrder.order_id },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            email: true,
            first_name: true,
            last_name: true
          }
        },
        address: true,
        promocode: true,
        shipping_method: true,
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { is_primary: true },
                  take: 1,
                },
              },
            },
          }
        }
      }
    });

    return {
      ...completeOrder,
      items: completeOrder.items.map(item => ({
        ...item,
        product: addFullImageUrls(item.product)
      }))
    };
  } catch (error) {
    throw new Error(`Error creating order: ${error.message}`);
  }
};

// Update payment proof (using secure token)
const updatePaymentProof = async (secureToken, paymentProofPath) => {
  try {
    const updatedOrder = await prisma.orders.update({
      where: {
        secure_token: secureToken
      },
      data: {
        payment_proof: paymentProofPath,
        status: 'confirmed'
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return {
      ...updatedOrder,
      items: updatedOrder.items.map(item => ({
        ...item,
        product: addFullImageUrls(item.product)
      }))
    };
  } catch (error) {
    throw new Error(`Error updating payment proof: ${error.message}`);
  }
};

// Update order status (admin only - uses order_id)
const updateOrderStatus = async (orderId, status) => {
  try {
    const updatedOrder = await prisma.orders.update({
      where: {
        order_id: parseInt(orderId)
      },
      data: {
        status
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return {
      ...updatedOrder,
      items: updatedOrder.items.map(item => ({
        ...item,
        product: addFullImageUrls(item.product)
      }))
    };
  } catch (error) {
    throw new Error(`Error updating order status: ${error.message}`);
  }
};

// Update payment status (admin only - uses order_id)
// Update payment status (admin only - uses order_id)
const updatePaymentStatus = async (orderId, paymentStatus, paymentMethod = null) => {
  try {
    const updateData = {
      payment_status: paymentStatus
    };

    if (paymentMethod) {
      updateData.payment_method = paymentMethod;
    }

    // If payment is confirmed, decrement stock
    if (paymentStatus === 'paid') {
      // Get order OUTSIDE transaction
      const order = await prisma.orders.findUnique({
        where: { order_id: parseInt(orderId) },
        include: { items: true }
      });

      if (!order) {
        throw new Error('Order not found');
      }

      if (order.payment_status === 'paid') {
        throw new Error('Payment already confirmed, stock already adjusted');
      }

      // Validate stock OUTSIDE transaction
      for (const item of order.items) {
        const product = await prisma.products.findUnique({
          where: { product_id: item.product_id }
        });

        if (!product) {
          throw new Error(`Product ${item.product_id} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Required: ${item.quantity}`);
        }
      }

      // Do the updates in transaction
      await prisma.$transaction(async (tx) => {
        // Decrement stock
        for (const item of order.items) {
          await tx.products.update({
            where: { product_id: item.product_id },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
        }

        // Update payment status
        await tx.orders.update({
          where: { order_id: parseInt(orderId) },
          data: {
            ...updateData,
            status: 'processing'
          }
        });
      }, {
        maxWait: 5000,
        timeout: 10000,
      });

      // Fetch updated order OUTSIDE transaction
      const updatedOrder = await prisma.orders.findUnique({
        where: { order_id: parseInt(orderId) },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      return {
        ...updatedOrder,
        items: updatedOrder.items.map(item => ({
          ...item,
          product: addFullImageUrls(item.product)
        }))
      };
    } else {
      const updatedOrder = await prisma.orders.update({
        where: {
          order_id: parseInt(orderId)
        },
        data: updateData,
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      return {
        ...updatedOrder,
        items: updatedOrder.items.map(item => ({
          ...item,
          product: addFullImageUrls(item.product)
        }))
      };
    }
  } catch (error) {
    throw new Error(`Error updating payment status: ${error.message}`);
  }
};

// Cancel order (can use secure_token or order_id)
// Cancel order (can use secure_token or order_id)
const cancelOrder = async (identifier, useToken = true) => {
  try {
    const whereClause = useToken 
      ? { secure_token: identifier }
      : { order_id: parseInt(identifier) };

    // Get order OUTSIDE transaction
    const order = await prisma.orders.findUnique({
      where: whereClause,
      include: { items: true }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Do updates in transaction
    await prisma.$transaction(async (tx) => {
      // Only restore stock if payment was already confirmed
      if (order.payment_status === 'paid') {
        for (const item of order.items) {
          await tx.products.update({
            where: { product_id: item.product_id },
            data: {
              stock: {
                increment: item.quantity
              }
            }
          });
        }
      }

      await tx.orders.update({
        where: whereClause,
        data: {
          status: 'cancelled'
        }
      });
    }, {
      maxWait: 5000,
      timeout: 10000,
    });

    // Fetch updated order OUTSIDE transaction
    const cancelledOrder = await prisma.orders.findUnique({
      where: whereClause,
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return {
      ...cancelledOrder,
      items: cancelledOrder.items.map(item => ({
        ...item,
        product: addFullImageUrls(item.product)
      }))
    };
  } catch (error) {
    throw new Error(`Error cancelling order: ${error.message}`);
  }
};

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
};

module.exports = {
  getAllOrders,
  getOrdersByUser,
  getOrderById,
  getOrderByToken,
  getOrderByOrderNumber,
  createOrder,
  updatePaymentProof,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  generateOrderNumber,
  generateSecureToken
};