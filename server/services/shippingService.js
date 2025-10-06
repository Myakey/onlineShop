// services/shippingService.js
const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');
// Import querystring to safely encode form data, although Axios can often handle it
const qs = require('querystring'); 

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY_COST;
const API_URL = 'https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost';
const ALL_COURIERS = 'jne:sicepat:ide:sap:jnt:ninja:tiki:lion:anteraja:pos:ncs:rex:rpx:sentral:star:wahana:dse';

async function calculateShippingCost(originDistrictId, destinationDistrictId, weight) {
  if (!RAJAONGKIR_API_KEY) {
    throw new Error("RAJAONGKIR_API_KEY_COST is not set in environment variables.");
  }
  
  try {
    // Data must be sent as application/x-www-form-urlencoded as per documentation
    const requestData = {
      origin: originDistrictId,
      destination: destinationDistrictId,
      weight: weight,
      courier: ALL_COURIERS,
      price: 'lowest' // Parameter to sort by lowest price
    };

    const response = await axios.post(
      API_URL,
      // Use qs.stringify to convert the object to x-www-form-urlencoded string
      qs.stringify(requestData),
      {
        headers: {
          'key': RAJAONGKIR_API_KEY,
          // Crucial: Set the correct Content-Type for form-urlencoded data
          'Content-Type': 'application/x-www-form-urlencoded' 
        }
      }
    );
    
    // The successful response data structure you provided is:
    // {"meta":{...},"data":[...]}
    // We return the whole response data object.
    return response.data;

  } catch (error) {
    // Axios error handling for bad responses
    if (error.response) {
      console.error("RajaOngkir API Error:", error.response.data);
      throw new Error(`Shipping calculation failed with status ${error.response.status}: ${error.response.data.meta.message || error.response.statusText}`);
    }
    throw new Error(`Shipping calculation failed: ${error.message}`);
  }
}

module.exports = { calculateShippingCost };