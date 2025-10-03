// controllers/orderController.js

const orderModels = require("../models/order");

// Admin only - Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModels.getAllOrders();
    res.json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderModels.getOrderById(id);
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: "Order not found" 
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Get order by order number
const getOrderByOrderNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = await orderModels.getOrderByOrderNumber(orderNumber);
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: "Order not found" 
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Get orders by user (authenticated user can view their own orders)
const getOrdersByUser = async (req, res) => {
  try {
    // Get userId from authenticated user or params (for admin)
    const userId = req.user?.user_id || req.params.userId;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: "User ID is required" 
      });
    }
    
    const orders = await orderModels.getOrdersByUser(userId);
    
    res.json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Create new order
const createOrder = async (req, res) => {
  try {
    const { 
      address_id, 
      payment_method, 
      notes,
      items // Array of { product_id, quantity, price }
    } = req.body;
    
    const userId = req.user.user_id; // From authenticated user
    
    // Validation
    if (!address_id || !items || items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "Address and items are required" 
      });
    }
    
    // Calculate total amount
    const total_amount = items.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * parseInt(item.quantity));
    }, 0);
    
    // Generate unique order number
    const order_number = orderModels.generateOrderNumber();
    
    const orderData = {
      user_id: userId,
      address_id,
      order_number,
      total_amount,
      status: 'pending',
      payment_method,
      payment_status: 'unpaid',
      notes,
      items
    };
    
    const newOrder = await orderModels.createOrder(orderData);
    
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: newOrder
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Valid statuses: pending, confirmed, processing, shipped, delivered, cancelled
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }
    
    const updatedOrder = await orderModels.updateOrderStatus(id, status);
    
    res.json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Update payment status (admin only)
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status, payment_method } = req.body;
    
    // Valid payment statuses: unpaid, paid, refunded, failed
    const validStatuses = ['unpaid', 'paid', 'refunded', 'failed'];
    
    if (!payment_status || !validStatuses.includes(payment_status)) {
      return res.status(400).json({ 
        success: false,
        message: `Invalid payment status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }
    
    const updatedOrder = await orderModels.updatePaymentStatus(id, payment_status, payment_method);
    
    res.json({
      success: true,
      message: "Payment status updated successfully",
      data: updatedOrder
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    
    // Get order to check ownership (users can only cancel their own orders)
    const order = await orderModels.getOrderById(id);
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: "Order not found" 
      });
    }
    
    // Check if user owns the order (unless admin)
    if (order.user_id !== userId && req.user.type !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: "You don't have permission to cancel this order" 
      });
    }
    
    // Check if order can be cancelled
    const cancelableStatuses = ['pending', 'confirmed'];
    if (!cancelableStatuses.includes(order.status)) {
      return res.status(400).json({ 
        success: false,
        message: `Order cannot be cancelled. Current status: ${order.status}` 
      });
    }
    
    const cancelledOrder = await orderModels.cancelOrder(id);
    
    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: cancelledOrder
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  getOrderByOrderNumber,
  getOrdersByUser,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder
};