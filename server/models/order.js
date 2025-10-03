const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const addFullImageUrls = (products) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:8080'
    
  if (Array.isArray(products)) {
    return products.map(product => ({
      ...product,
      image_url: product.image_url ? `${baseUrl}${product.image_url}` : null
    }));
  } else {
    return {
      ...products,
      image_url: products.image_url ? `${baseUrl}${products.image_url}` : null
    };
  }
};

const getAllOrders = async () => {
    try{
        const orders = await prisma.orders.findMany({
            orderBy: {
                order_id: 'desc'
            }
        });
        return orders;
    } catch(error){
        throw new Error(`Error fetching orders : ${error}`);
    }
}

const getOrderByUser = async (userId) => {
    try{
        const orders = await prisma.orders.findMany({
            where: {
                user_id: parseInt(userId)
            }
        })

        if(!orders)
            return null;
        
        return orders;
    } catch(error){
        throw new Error(`Error fetching orders: ${error.message}`);
    }
};

const createOrder = async (orderData) => {
    try{
        const {user_id, address_id, order_number, total_amount, status, payment_status, notes = null } = orderData

        const newOrder = await prisma.orders.create({
            data:{
                user_id,
                address_id,
                order_number,
                total_amount,
                status,
                payment_status,
                notes
            }
        });
        return newOrder;

    }catch (error){
        throw new Error(`Error creating order: ${error.message}`);
    }
}