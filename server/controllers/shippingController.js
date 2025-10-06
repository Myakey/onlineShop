const shippingModel = require('../models/shipping');
const { calculateShippingCost } = require("../services/shippingService");

const getDestinationDistrictId = async (districtId) => {
    try {
        if (!districtId) {
        return res.status(400).json({
            success: false,
            message: 'districtId is required'
        });
        }
    
        const providerDistrictId = await shippingModel.destinationDistrictId(districtId);
        if (!providerDistrictId) {
        return res.status(404).json({
            success: false,
            message: 'Mapping not found for the given district ID'
        });
        }
    
        return providerDistrictId;
    } catch (err) {
        throw new Error(`Failed to get destination district ID: ${err.message}`);
    }
}

const calculateShipping = async (req, res) => {
    console.log(req.body);
    try {
        const { districtId, weight } = req.body;
        originDistrictId = 6193

        const destinationId = await getDestinationDistrictId(districtId);
        console.log("Destination Id", destinationId)
    
        if (!originDistrictId || !destinationId|| !weight) {
        return res.status(400).json({
            success: false,
            message: 'originDistrictId, destinationDistrictId, and weight are required'
        });
        }
    
        const shippingOptions = await calculateShippingCost(originDistrictId, destinationId, weight);

        res.json({
        success: true,
        data: shippingOptions
        });
        
    } catch (err) {
        res.status(500).json({
        success: false,
        message: err.message
        });
    }
}

module.exports = {
    getDestinationDistrictId,
    calculateShipping
};