// controllers/shippingController.js
const shippingMethodsModel = require("../models/shippingMethods");
const shippingService = require("../services/shippingService");
const userModel = require("../models/userModel"); 
const prisma = require("../config/prisma");

// Get all shipping methods (from database - fallback)
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

/**
 * Calculate shipping cost using Biteship API
 * Request body:
 * - address_id: ID of the delivery address
 * - items: Array of { product_id, quantity }
 */
const calculateShippingCost = async (req, res) => {
  try {
    const { address_id, items } = req.body;
    const userId = req.user.id; // From authentication middleware

    // === VALIDATION ===
    if (!address_id) {
      return res.status(400).json({
        success: false,
        message: "address_id is required",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "items array is required and must not be empty",
      });
    }

    // Validate items structure
    for (const item of items) {
      if (!item.product_id || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: "Each item must have product_id and quantity",
        });
      }
    }

    // === FETCH USER ADDRESSES USING USER MODEL ===
    const addresses = await userModel.getUserAddresses(userId);
    
    if (!addresses || addresses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No addresses found for user",
      });
    }

    // Find the specific address by ID
    const address = addresses.find(addr => addr.address_id === parseInt(address_id));

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found or does not belong to user",
      });
    }

    // Check if address has coordinates
    if (!address.latitude || !address.longitude) {
      return res.status(400).json({
        success: false,
        message: "Address does not have coordinates. Please update your address in profile settings.",
        hint: "Coordinates are required for accurate shipping calculation"
      });
    }

    // === FETCH PRODUCT DETAILS FROM DATABASE (Prisma) ===
    const productIds = items.map(item => parseInt(item.product_id));
    
    const products = await prisma.products.findMany({
      where: {
        product_id: {
          in: productIds
        }
      },
      select: {
        product_id: true,
        name: true,
        description: true,
        price: true,
        weight: true,
        length: true,
        width: true,
        height: true,
        stock: true,
      }
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some products not found",
      });
    }

    // Create product map for easy lookup
    const productMap = {};
    products.forEach(product => {
      productMap[product.product_id] = product;
    });

    // === VALIDATE STOCK ===
    for (const item of items) {
      const product = productMap[item.product_id];
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.product_id} not found`,
        });
      }
      
      if (item.quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        });
      }
    }

    // === PREPARE BITESHIP REQUEST ===
    const biteshipItems = items.map(item => {
      const product = productMap[item.product_id];
      
      return {
        name: product.name,
        description: product.description || `Product ${product.product_id}`,
        value: Math.round(Number(product.price)),
        length: Math.round(Number(product.length) || 10), // cm, default 10cm if not set
        width: Math.round(Number(product.width) || 10),   // cm
        height: Math.round(Number(product.height) || 10), // cm
        weight: Math.round(Number(product.weight) || 500), // grams, default 500g if not set
        quantity: parseInt(item.quantity),
      };
    });

    const requestData = {
      origin_postal_code: parseInt(process.env.SHOP_POSTAL_CODE || 12440),
      destination_latitude: parseFloat(address.latitude),
      destination_longitude: parseFloat(address.longitude),
      couriers: "jne,sicepat,paxel,anteraja,jnt,ninja,lion,idexpress",
      items: biteshipItems,
    };

    console.log('Calling Biteship API with:', JSON.stringify(requestData, null, 2));

    // === CALL BITESHIP API ===
    const shippingData = await shippingService.calculateShippingCost(requestData);

    // === VALIDATE RESPONSE ===
    if (!shippingData.success || !shippingData.pricing) {
      return res.status(500).json({
        success: false,
        message: "Failed to get shipping rates from provider",
      });
    }

    // === FORMAT RESPONSE ===
    const formattedRates = shippingData.pricing.map((rate, index) => ({
      id: `rate-${index}`,
      courier_name: rate.courier_name,
      courier_code: rate.courier_code,
      courier_service_name: rate.courier_service_name,
      courier_service_code: rate.courier_service_code,
      description: rate.description || '',
      duration: rate.duration || '',
      shipment_duration_range: rate.shipment_duration_range || '',
      shipment_duration_unit: rate.shipment_duration_unit || '',
      price: Math.round(rate.price),
      type: rate.type,
      company: rate.company,
    }));

    // Sort by price (cheapest first)
    formattedRates.sort((a, b) => a.price - b.price);

    res.json({
      success: true,
      data: {
        origin: {
          postal_code: process.env.SHOP_POSTAL_CODE || 12440,
        },
        destination: {
          address_id: address.address_id,
          recipient_name: address.recipient_name,
          latitude: address.latitude,
          longitude: address.longitude,
          full_address: [
            address.street_address,
            address.district,
            address.city,
            address.province,
            address.postal_code
          ].filter(Boolean).join(', '),
        },
        items: biteshipItems,
        pricing: formattedRates,
      },
    });

  } catch (err) {
    console.error("Shipping calculation error:", err);
    
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Failed to calculate shipping cost",
      details: process.env.NODE_ENV === 'development' ? err.details : undefined,
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
  calculateShippingCost,
  createShippingMethod,
  updateShippingMethod,
  deleteShippingMethod,
};