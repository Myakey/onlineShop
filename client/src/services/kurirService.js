import api from "./api";

const calculateShipping = async (data) => {
  try {
    const response = await api.post('/shipping/calculate-shipping', data);
    return response.data;
  } catch (error) {
    console.error("Error calculating shipping:", error);
    throw error;
  }
};

const kurirService = {
  calculateShipping
};

export default kurirService;