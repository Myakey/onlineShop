const shippingMethodsModel = require("../models/shippingMethods");

// Get all shipping methods
const getAllShippingMethods = async (req, res) => {
  try {
    const methods = await shippingMethodsModel.getAllShippingMethods();
    
    res.json({
      success: true,
      data: methods,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get shipping method by ID
const getShippingMethodById = async (req, res) => {
  try {
    const { id } = req.params;
    const method = await shippingMethodsModel.getShippingMethodById(id);

    if (!method) {
      return res.status(404).json({
        success: false,
        message: "Shipping method not found",
      });
    }

    res.json({
      success: true,
      data: method,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Create shipping method (admin only)
const createShippingMethod = async (req, res) => {
  try {
    const { name, courier, base_cost, estimated_days } = req.body;

    if (!name || !courier || !base_cost || !estimated_days) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const method = await shippingMethodsModel.createShippingMethod({
      name,
      courier,
      base_cost,
      estimated_days,
    });

    res.status(201).json({
      success: true,
      message: "Shipping method created successfully",
      data: method,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update shipping method (admin only)
const updateShippingMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const method = await shippingMethodsModel.updateShippingMethod(id, updateData);

    res.json({
      success: true,
      message: "Shipping method updated successfully",
      data: method,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete shipping method (admin only)
const deleteShippingMethod = async (req, res) => {
  try {
    const { id } = req.params;

    await shippingMethodsModel.deleteShippingMethod(id);

    res.json({
      success: true,
      message: "Shipping method deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getAllShippingMethods,
  getShippingMethodById,
  createShippingMethod,
  updateShippingMethod,
  deleteShippingMethod,
};