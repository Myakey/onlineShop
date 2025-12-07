const shipmentModel = require("../models/shipment");

// Create shipment (admin only)
const createShipment = async (req, res) => {
  try {
    const { order_id, tracking_number, courier, shipped_at, status } = req.body;

    if (!order_id || !courier) {
      return res.status(400).json({
        success: false,
        message: "Order ID and courier are required",
      });
    }

    const shipment = await shipmentModel.createShipment({
      order_id,
      tracking_number,
      courier,
      shipped_at,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Shipment created successfully",
      data: shipment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get shipment by ID
const getShipmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.type === "admin";

    const shipment = await shipmentModel.getShipmentById(id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    // Check ownership (unless admin)
    if (!isAdmin && shipment.order.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this shipment",
      });
    }

    res.json({
      success: true,
      data: shipment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get shipment by order ID
const getShipmentByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.type === "admin";

    const shipment = await shipmentModel.getShipmentByOrder(orderId);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found for this order",
      });
    }

    // Check ownership (unless admin)
    if (!isAdmin && shipment.order.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this shipment",
      });
    }

    res.json({
      success: true,
      data: shipment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Track shipment by tracking number (public)
const trackShipment = async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const shipment = await shipmentModel.trackShipment(trackingNumber);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    res.json({
      success: true,
      data: shipment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update shipment status (admin only)
const updateShipmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, delivered_at } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const shipment = await shipmentModel.updateShipmentStatus(id, status, delivered_at);

    res.json({
      success: true,
      message: "Shipment status updated successfully",
      data: shipment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update shipment by order ID (admin only)
const updateShipmentByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updateData = req.body;

    const shipment = await shipmentModel.updateShipmentByOrder(orderId, updateData);

    res.json({
      success: true,
      message: "Shipment updated successfully",
      data: shipment,
    });
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).json({
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

module.exports = {
  createShipment,
  getShipmentById,
  getShipmentByOrder,
  trackShipment,
  updateShipmentStatus,
  updateShipmentByOrder,
};