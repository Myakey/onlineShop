// Shipping methods model 
const prisma = require("../config/prisma")

// Get all shipping methods
const getAllShippingMethods = async () => {
  try {
    const methods = await prisma.shipping_methods.findMany({
      orderBy: {
        base_cost: "asc",
      },
    });

    return methods;
  } catch (error) {
    throw new Error(`Error fetching shipping methods: ${error.message}`);
  }
};

// Get shipping method by ID
const getShippingMethodById = async (methodId) => {
  try {
    const method = await prisma.shipping_methods.findUnique({
      where: { shipping_method_id: parseInt(methodId) },
    });

    return method;
  } catch (error) {
    throw new Error(`Error fetching shipping method: ${error.message}`);
  }
};

// Create shipping method (admin)
const createShippingMethod = async (methodData) => {
  try {
    const { name, courier, base_cost, estimated_days } = methodData;

    const method = await prisma.shipping_methods.create({
      data: {
        name,
        courier,
        base_cost: parseFloat(base_cost),
        estimated_days: parseInt(estimated_days),
      },
    });

    return method;
  } catch (error) {
    throw new Error(`Error creating shipping method: ${error.message}`);
  }
};

// Update shipping method (admin)
const updateShippingMethod = async (methodId, updateData) => {
  try {
    const data = {};
    if (updateData.name) data.name = updateData.name;
    if (updateData.courier) data.courier = updateData.courier;
    if (updateData.base_cost) data.base_cost = parseFloat(updateData.base_cost);
    if (updateData.estimated_days)
      data.estimated_days = parseInt(updateData.estimated_days);

    const method = await prisma.shipping_methods.update({
      where: { shipping_method_id: parseInt(methodId) },
      data,
    });

    return method;
  } catch (error) {
    throw new Error(`Error updating shipping method: ${error.message}`);
  }
};

// Delete shipping method (admin)
const deleteShippingMethod = async (methodId) => {
  try {
    await prisma.shipping_methods.delete({
      where: { shipping_method_id: parseInt(methodId) },
    });

    return { message: "Shipping method deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting shipping method: ${error.message}`);
  }
};

module.exports = {
  getAllShippingMethods,
  getShippingMethodById,
  createShippingMethod,
  updateShippingMethod,
  deleteShippingMethod,
};
