// Shipment.js
// Create shipment for order
const prisma = require("../config/prisma");

const createShipment = async (shipmentData) => {
  try {
    const {
      order_id,
      tracking_number,
      courier,
      shipped_at = new Date(),
      status = "in_transit",
    } = shipmentData;

    const shipment = await prisma.shipments.create({
      data: {
        order_id: parseInt(order_id),
        tracking_number,
        courier,
        shipped_at,
        status,
      },
      include: {
        order: {
          include: {
            user: {
              select: {
                user_id: true,
                username: true,
                email: true,
                first_name: true,
                last_name: true,
              },
            },
            address: true,
          },
        },
      },
    });

    // Update order status to shipped
    await prisma.orders.update({
      where: { order_id: parseInt(order_id) },
      data: { status: "shipped" },
    });

    return shipment;
  } catch (error) {
    throw new Error(`Error creating shipment: ${error.message}`);
  }
};

// Get shipment by ID
const getShipmentById = async (shipmentId) => {
  try {
    const shipment = await prisma.shipments.findUnique({
      where: { shipment_id: parseInt(shipmentId) },
      include: {
        order: {
          include: {
            user: {
              select: {
                user_id: true,
                username: true,
                email: true,
                first_name: true,
                last_name: true,
              },
            },
            address: true,
          },
        },
      },
    });

    return shipment;
  } catch (error) {
    throw new Error(`Error fetching shipment: ${error.message}`);
  }
};

// Get shipment by order ID (returns single shipment - one order = one shipment)
const getShipmentByOrder = async (orderId) => {
  try {
    const shipment = await prisma.shipments.findFirst({
      where: { order_id: parseInt(orderId) },
      include: {
        order: {
          include: {
            user: {
              select: {
                user_id: true,
                username: true,
                email: true,
                first_name: true,
                last_name: true,
              },
            },
            address: true,
          },
        },
      },
    });

    return shipment;
  } catch (error) {
    throw new Error(`Error fetching shipment: ${error.message}`);
  }
};

// Update shipment status
const updateShipmentStatus = async (shipmentId, status, deliveredAt = null) => {
  try {
    const updateData = { status };

    if (status === "delivered") {
      updateData.delivered_at = deliveredAt || new Date();
    }

    const shipment = await prisma.shipments.update({
      where: { shipment_id: parseInt(shipmentId) },
      data: updateData,
      include: {
        order: true,
      },
    });

    // Update order status if delivered
    if (status === "delivered") {
      await prisma.orders.update({
        where: { order_id: shipment.order_id },
        data: { status: "delivered" },
      });
    }

    return shipment;
  } catch (error) {
    throw new Error(`Error updating shipment status: ${error.message}`);
  }
};

// Track shipment by tracking number
const trackShipment = async (trackingNumber) => {
  try {
    const shipment = await prisma.shipments.findFirst({
      where: { tracking_number: trackingNumber },
      include: {
        order: {
          include: {
            user: {
              select: {
                user_id: true,
                username: true,
                email: true,
                first_name: true,
                last_name: true,
              },
            },
            address: true,
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    return shipment;
  } catch (error) {
    throw new Error(`Error tracking shipment: ${error.message}`);
  }
};

// Update shipment by order ID (convenience method)
const updateShipmentByOrder = async (orderId, updateData) => {
  try {
    const { tracking_number, courier, status, shipped_at, delivered_at } = updateData;
    
    const shipment = await prisma.shipments.findFirst({
      where: { order_id: parseInt(orderId) },
    });

    if (!shipment) {
      throw new Error('Shipment not found for this order');
    }

    const data = {};
    if (tracking_number) data.tracking_number = tracking_number;
    if (courier) data.courier = courier;
    if (status) data.status = status;
    if (shipped_at) data.shipped_at = shipped_at;
    if (delivered_at) data.delivered_at = delivered_at;

    const updatedShipment = await prisma.shipments.update({
      where: { shipment_id: shipment.shipment_id },
      data,
      include: {
        order: true,
      },
    });

    // Update order status if delivered
    if (status === "delivered") {
      await prisma.orders.update({
        where: { order_id: parseInt(orderId) },
        data: { status: "delivered" },
      });
    }

    return updatedShipment;
  } catch (error) {
    throw new Error(`Error updating shipment: ${error.message}`);
  }
};

module.exports = {
  createShipment,
  getShipmentById,
  getShipmentByOrder,
  updateShipmentStatus,
  updateShipmentByOrder,
  trackShipment,
};
