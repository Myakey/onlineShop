// controllers/orderController.js

const orderModels = require("../models/orderModel");
const { sendPaymentConfirmationEmail } = require("../services/emailService");
const paymentModel = require("../models/payment");

// Admin only - Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModels.getAllOrders();
    res.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get order by secure token (PRIMARY USER METHOD)
const getOrderByToken = async (req, res) => {
  try {
    const { token } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.type === "admin";

    const order = await orderModels.getOrderByToken(token);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user owns the order (unless admin)
    if (order.user_id !== userId && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this order",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get order by ID (ADMIN ONLY)
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user.type === "admin";

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Use secure token instead.",
      });
    }

    const order = await orderModels.getOrderById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get order by order number
const getOrderByOrderNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.type === "admin";

    const order = await orderModels.getOrderByOrderNumber(orderNumber);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user_id !== userId && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this order",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get orders by user
const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderModels.getOrdersByUser(userId);

    res.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Create new order with payment channel support
const createOrder = async (req, res) => {
  try {
    const {
      address_id,
      notes = "",
      items,
      promocode_id = null,
      shipping_method_id = null,
      shipping_cost = 0,
      voucher_discount = 0,
      payment_data, // NEW: Contains payment channel info
    } = req.body;

    const userId = req.user.id;

    // Validations
    if (!address_id || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Address and items are required",
      });
    }

    if (!payment_data || !payment_data.payment_channel) {
      return res.status(400).json({
        success: false,
        message: "Payment channel is required",
      });
    }

    // Validate payment channel
    const validChannels = ["full_transfer", "split_payment", "marketplace"];
    if (!validChannels.includes(payment_data.payment_channel)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment channel",
      });
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum, item) => sum + parseFloat(item.price) * parseInt(item.quantity),
      0
    );

    // Shipping cost is 0 for marketplace, otherwise use provided value
    const finalShippingCost = payment_data.payment_channel === "marketplace" ? 0 : parseFloat(shipping_cost);
    const discountAmount = parseFloat(voucher_discount);
    const totalAmount = subtotal + finalShippingCost - discountAmount;

    // Generate order number
    const order_number = orderModels.generateOrderNumber();

    // Create order
    const newOrder = await orderModels.createOrder({
      user_id: userId,
      address_id,
      order_number,
      status: "pending",
      notes,
      promocode_id,
      shipping_method_id,
      items,
      decrementStock: false, // Stock will be decremented when payment is confirmed
    });

    // Prepare payment data based on channel
    let paymentPayload = {
      order_id: newOrder.order_id,
      invoice_id: null,
      payment_status: "unpaid",
    };

    // Handle different payment channels
    switch (payment_data.payment_channel) {
      case "full_transfer":
        paymentPayload = {
          ...paymentPayload,
          payment_type: "transfer",
          payment_amount: totalAmount,
          method_name: "BCA",
          payment_channel: "bank_transfer",
        };
        break;

      case "split_payment":
        // Validate split amounts
        const transferAmount = parseFloat(payment_data.split_transfer_amount || 0);
        const marketplaceAmount = parseFloat(payment_data.split_marketplace_amount || 0);

        if (transferAmount + marketplaceAmount !== subtotal) {
          return res.status(400).json({
            success: false,
            message: "Split payment amounts must equal product subtotal",
          });
        }

        if (transferAmount <= 0 || marketplaceAmount <= 0) {
          return res.status(400).json({
            success: false,
            message: "Both payment amounts must be greater than 0",
          });
        }

        // Create two payment records for split payment
        // 1. Transfer payment
        await paymentModel.createPayment({
          order_id: newOrder.order_id,
          invoice_id: null,
          payment_status: "unpaid",
          payment_type: "transfer",
          payment_amount: transferAmount + finalShippingCost, // Include shipping in transfer
          method_name: "BCA",
          payment_channel: "bank_transfer",
        });

        // 2. Marketplace payment
        paymentPayload = {
          order_id: newOrder.order_id,
          invoice_id: null,
          payment_status: "unpaid",
          payment_type: payment_data.marketplace_platform || "shopee",
          payment_amount: marketplaceAmount,
          method_name: payment_data.marketplace_platform === "shopee" ? "Shopee" : "TikTok Shop",
          payment_channel: "marketplace",
        };
        break;

      case "marketplace":
        // Validate marketplace link
        if (!payment_data.marketplace_link || !payment_data.marketplace_link.trim()) {
          return res.status(400).json({
            success: false,
            message: "Marketplace product link is required",
          });
        }

        paymentPayload = {
          ...paymentPayload,
          payment_type: payment_data.marketplace_platform || "shopee",
          payment_amount: subtotal, // No shipping cost for marketplace
          method_name: payment_data.marketplace_platform === "shopee" ? "Shopee" : "TikTok Shop",
          payment_channel: "marketplace",
          marketplace_order_id: payment_data.marketplace_link,
        };
        break;
    }

    // Create payment record(s)
    const payment = await paymentModel.createPayment(paymentPayload);

    // Prepare response message based on payment channel
    let responseMessage = "Order created successfully!";
    let additionalInfo = {};

    switch (payment_data.payment_channel) {
      case "full_transfer":
        responseMessage = "Order created! Please transfer to BCA account and upload payment proof.";
        additionalInfo.bankAccount = {
          bank: "BCA",
          accountNumber: "1234567890", // Replace with actual account
          accountName: "Monmon's Hobbies",
          amount: totalAmount,
        };
        break;

      case "split_payment":
        responseMessage = "Order created! Please complete both payments.";
        additionalInfo.splitPayment = {
          transfer: {
            bank: "BCA",
            accountNumber: "1234567890",
            accountName: "Monmon's Hobbies",
            amount: parseFloat(payment_data.split_transfer_amount) + finalShippingCost,
          },
          marketplace: {
            platform: payment_data.marketplace_platform,
            amount: parseFloat(payment_data.split_marketplace_amount),
          },
        };
        break;

      case "marketplace":
        responseMessage = `Order created! Please checkout at ${payment_data.marketplace_platform}.`;
        additionalInfo.marketplaceLink = payment_data.marketplace_link;
        break;
    }

    res.status(201).json({
      success: true,
      message: responseMessage,
      data: {
        order: {
          ...newOrder,
          subtotal,
          shipping_cost: finalShippingCost,
          discount: discountAmount,
          total_amount: totalAmount,
        },
        payment,
        ...additionalInfo,
      },
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const updatedOrder = await orderModels.updateOrderStatus(id, status);

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Cancel order (using secure token)
const cancelOrder = async (req, res) => {
  try {
    const { token } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.type === "admin";

    const order = await orderModels.getOrderByToken(token);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user_id !== userId && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to cancel this order",
      });
    }

    const cancelableStatuses = ["pending", "confirmed"];
    if (!cancelableStatuses.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled. Current status: ${order.status}`,
      });
    }

    const cancelledOrder = await orderModels.cancelOrder(token, true);

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: cancelledOrder,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Cancel order by ID (admin only)
const cancelOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user.type === "admin";

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const order = await orderModels.getOrderById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const cancelableStatuses = ["pending", "confirmed"];
    if (!cancelableStatuses.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled. Current status: ${order.status}`,
      });
    }

    const cancelledOrder = await orderModels.cancelOrder(id, false);

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: cancelledOrder,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  getOrderByToken,
  getOrderByOrderNumber,
  getOrdersByUser,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  cancelOrderById,
};