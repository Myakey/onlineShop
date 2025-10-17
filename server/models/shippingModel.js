const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const destinationDistrictId = async (districtId) => {
    try {
        const mapping = await prisma.shipping_provider_mappings.findFirst({
            where: {
                provider_name: 'rajaongkir',
                entity_type: 'district',
                entity_id: districtId
            }
        });
        return mapping ? mapping.provider_id : null;
    } catch (err) {
        throw new Error(`Failed to fetch destination district ID: ${err.message}`);
    }
}
module.exports = {
    destinationDistrictId
};