  // controllers/orderController.js

  const orderModels = require("../models/order");
  const { sendPaymentConfirmationEmail } = require("../services/emailService");

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
      const userId = req.user.id;
      const isAdmin = req.user.type === 'admin';
      
      const order = await orderModels.getOrderById(id);
      
      if (!order) {
        return res.status(404).json({ 
          success: false,
          message: "Order not found" 
        });
      }
      
      // Check if user owns the order (unless admin)
      if (order.user_id !== userId && !isAdmin) {
        return res.status(403).json({ 
          success: false,
          message: "You don't have permission to view this order" 
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
      const userId = req.user.id;
      const isAdmin = req.user.type === 'admin';
      
      const order = await orderModels.getOrderByOrderNumber(orderNumber);
      
      if (!order) {
        return res.status(404).json({ 
          success: false,
          message: "Order not found" 
        });
      }
      
      // Check if user owns the order (unless admin)
      if (order.user_id !== userId && !isAdmin) {
        return res.status(403).json({ 
          success: false,
          message: "You don't have permission to view this order" 
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
      const userId = req.user.id;
      
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

  // Create new order (from cart checkout)
  const createOrder = async (req, res) => {
    try {
      const { 
        address_id, 
        payment_method, 
        notes = "",
        items, // Array of { product_id, quantity, price }
        shipping_cost = 0,
        voucher_discount = 0
      } = req.body;
      
      const userId = req.user.id;
      
      // Validation
      if (!address_id || !items || items.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: "Address and items are required" 
        });
      }
      
      if (!payment_method) {
        return res.status(400).json({ 
          success: false,
          message: "Payment method is required" 
        });
      }
      
      // Calculate total amount
      const subtotal = items.reduce((sum, item) => {
        return sum + (parseFloat(item.price) * parseInt(item.quantity));
      }, 0);
      
      const total_amount = subtotal + parseFloat(shipping_cost) - parseFloat(voucher_discount);
      
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
        items,
        decrementStock: false // Don't decrement stock until payment confirmed
      };
      
      const newOrder = await orderModels.createOrder(orderData);

      console.log("New order created:", newOrder);
      
      res.status(201).json({
        success: true,
        message: "Order created successfully. Please upload payment proof.",
        data: newOrder
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        message: err.message 
      });
    }
  };

  // Upload payment proof
  const uploadPaymentProof = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Payment proof image is required"
        });
      }
      
      // Get order to check ownership
      const order = await orderModels.getOrderById(id);
      
      if (!order) {
        return res.status(404).json({ 
          success: false,
          message: "Order not found" 
        });
      }
      
      // Check if user owns the order
      if (order.user_id !== userId) {
        return res.status(403).json({ 
          success: false,
          message: "You don't have permission to upload payment for this order" 
        });
      }
      
      // Check if payment is still unpaid
      if (order.payment_status !== 'unpaid') {
        return res.status(400).json({ 
          success: false,
          message: `Payment already ${order.payment_status}. Cannot upload proof.` 
        });
      }
      
      // Save payment proof path
      const paymentProofPath = `/uploads/payment_proofs/${req.file.filename}`;
      
      const updatedOrder = await orderModels.updatePaymentProof(id, paymentProofPath);
      
      res.json({
        success: true,
        message: "Payment proof uploaded successfully. Waiting for admin verification.",
        data: updatedOrder
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

  // Update payment status (admin only) - with email notification
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
      
      // Send email notification if payment is confirmed
      if (payment_status === 'paid') {
        try {
          // Get full order details with user email
          const fullOrder = await orderModels.getOrderById(id);
          if (fullOrder && fullOrder.user && fullOrder.user.email) {
            await sendPaymentConfirmationEmail(fullOrder, fullOrder.user.email);
          }
        } catch (emailErr) {
          console.error("Failed to send email:", emailErr);
          // Continue even if email fails
        }
      }
      
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
      const userId = req.user.id;
      const isAdmin = req.user.type === 'admin';
      
      // Get order to check ownership
      const order = await orderModels.getOrderById(id);
      
      if (!order) {
        return res.status(404).json({ 
          success: false,
          message: "Order not found" 
        });
      }
      
      // Check if user owns the order (unless admin)
      if (order.user_id !== userId && !isAdmin) {
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
    uploadPaymentProof,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder
  };