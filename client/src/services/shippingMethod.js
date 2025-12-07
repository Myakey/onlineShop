import api from "./api";

const getAllShippingMethods = async () => {
  try {
    const response = await api.get('/shippingMethods');
    return response.data;
  } catch (error) {
    console.error("Error fetching shipping methods:", error);
    throw error;
  }
};

// Get shipping method by ID (Public)
const getShippingMethodById = async (id) => {
  try {
    const response = await api.get(`/shippingMethods/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching shipping method:", error);
    throw error;
  }
};

// Create new shipping method (Admin only)
const createShippingMethod = async (data) => {
  try {
    const response = await api.post('/shippingMethods', data);
    return response.data;
  } catch (error) {
    console.error("Error creating shipping method:", error);
    throw error;
  }
};

// Update shipping method (Admin only)
const updateShippingMethod = async (id, data) => {
  try {
    const response = await api.put(`/shippingMethods/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating shipping method:", error);
    throw error;
  }
};

// Delete shipping method (Admin only)
const deleteShippingMethod = async (id) => {
  try {
    const response = await api.delete(`/shippingMethods/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting shipping method:", error);
    throw error;
  }
};

const shippingMethodService = {
  getAllShippingMethods,
  getShippingMethodById,
  createShippingMethod,
  updateShippingMethod,
  deleteShippingMethod
};

export default shippingMethodService;