// services/shippingService.js
const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const BITESHIP_API_KEY = process.env.ONGKIR_API;

const requestData = {
  origin_postal_code: 12440,
  destination_latitude: -6.2441792,
  destination_longitude: 106.783529,
  couriers: "paxel,jne,sicepat",
  items: [
    {
      name: "Shoes",
      description: "Black colored size 45",
      value: 199000,
      length: 30,
      width: 15,
      height: 20,
      weight: 200,
      quantity: 2
    }
  ]
};

async function calculateShippingCost(req, res) {
  try {
    const response = await axios.post(
      "https://api.biteship.com/v1/rates/couriers",
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${BITESHIP_API_KEY}`
        }
      }
    );

    return res.json({
      success: true,
      data: response.data, // send actual data only
    });

  } catch (error) {
    const errData = error.response?.data || { message: error.message };

    console.error("Shipping cost API error:", errData);

    return res.status(error.response?.status || 500).json({
      success: false,
      error: errData,
    });
  }
}

module.exports = { calculateShippingCost };
