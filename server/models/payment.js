//payment model
const prisma = require("../config/prisma");
const { updateInvoicePayment } = require('./invoice');

// Create payment with full details
const createPayment = async (paymentData) => {
  try {
    const {
      order_id,
      invoice_id,
      payment_status = "unpaid",
      payment_amount,
      payment_type, // transfer, shopee, tiktok, cash
      paid_at,
      // Payment method details
      method_name, // BCA, Shopee, TikTok
      payment_channel, // bank_transfer, marketplace
      bank_account_name,
      bank_account_number,
      // Marketplace details (if applicable)
      marketplace_order_id,
      marketplace_item_id,
      marketplace_fee_amount,
    } = paymentData;

    const payment = await prisma.$transaction(async (tx) => {
      // Create payment
      const newPayment = await tx.payments.create({
        data: {
          order_id: parseInt(order_id),
          invoice_id: invoice_id ? parseInt(invoice_id) : null,
          payment_status,
          payment_amount: parseFloat(payment_amount),
          payment_type,
          paid_at: paid_at || null,
        },
      });

      // Create payment method details if provided
      if (method_name || payment_channel) {
        await tx.payment_methods.create({
          data: {
            payment_id: newPayment.payment_id,
            method_name,
            payment_channel,
            bank_account_name: bank_account_name || null,
            bank_account_number: bank_account_number || null,
          },
        });
      }

      // Create marketplace details if provided
      if (marketplace_order_id || marketplace_item_id) {
        await tx.payment_marketplace_details.create({
          data: {
            payment_id: newPayment.payment_id,
            marketplace_order_id: marketplace_order_id || null,
            marketplace_item_id: marketplace_item_id || null,
            marketplace_fee_amount: marketplace_fee_amount
              ? parseFloat(marketplace_fee_amount)
              : null,
          },
        });
      }

      return newPayment;
    });

    // Fetch complete payment with relations
    return await getPaymentById(payment.payment_id);
  } catch (error) {
    throw new Error(`Error creating payment: ${error.message}`);
  }
};

const addPaymentProof = async (data) => {
  try {
    const { payment_id, image_url, cloudinary_id } = data;
    
    return await prisma.payment_proofs.create({
      data: {
        payment_id: parseInt(payment_id),
        file_url: image_url, // ⚠️ Schema uses file_url, not image_url
        // Note: cloudinary_id is NOT in your schema, so we can't store it
        // If you need cloudinary_id, add it to your Prisma schema first
      }
    });
  } catch (error) {
    throw new Error(`Error adding payment proof: ${error.message}`);
  }
}

// Get payment by ID
const getPaymentById = async (paymentId) => {
  try {
    const payment = await prisma.payments.findUnique({
      where: { payment_id: parseInt(paymentId) },
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
          },
        },
        invoice: true,
        payment_methods: true,
        payment_marketplace_details: true,
        payment_refunds: true,
      },
    });

    return payment;
  } catch (error) {
    throw new Error(`Error fetching payment: ${error.message}`);
  }
};

// Get payments by order ID
const getPaymentsByOrder = async (orderId) => {
  try {
    const payments = await prisma.payments.findMany({
      where: { order_id: parseInt(orderId) },
      include: {
        payment_methods: true,
        payment_marketplace_details: true,
        payment_refunds: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return payments;
  } catch (error) {
    throw new Error(`Error fetching payments: ${error.message}`);
  }
};

// Update payment status
const updatePaymentStatus = async (paymentId, status, paidAt = null) => {
  try {
    const payment = await prisma.payments.update({
      where: { payment_id: parseInt(paymentId) },
      data: {
        payment_status: status,
        paid_at: paidAt || (status === "paid" ? new Date() : null),
      },
      include: {
        order: true,
        invoice: true,
        payment_methods: true,
      },
    });

    // If payment is confirmed, update invoice
    if (status === "paid" && payment.invoice_id) {
      await updateInvoicePayment(payment.invoice_id, payment.payment_amount);
    }

    return payment;
  } catch (error) {
    throw new Error(`Error updating payment status: ${error.message}`);
  }
};

// Create refund
const createRefund = async (refundData) => {
  try {
    const { payment_id, refund_amount, refund_reason } = refundData;

    const payment = await prisma.payments.findUnique({
      where: { payment_id: parseInt(payment_id) },
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.payment_status !== "paid") {
      throw new Error("Can only refund paid payments");
    }

    const refund = await prisma.$transaction(async (tx) => {
      // Create refund record
      const newRefund = await tx.payment_refunds.create({
        data: {
          payment_id: parseInt(payment_id),
          refund_amount: parseFloat(refund_amount),
          refund_reason,
          refunded_at: new Date(),
        },
      });

      // Update payment status to refunded
      await tx.payments.update({
        where: { payment_id: parseInt(payment_id) },
        data: {
          payment_status: "refunded",
        },
      });

      return newRefund;
    });

    return refund;
  } catch (error) {
    throw new Error(`Error creating refund: ${error.message}`);
  }
};

// Get refunds by payment ID
const getRefundsByPayment = async (paymentId) => {
  try {
    const refunds = await prisma.payment_refunds.findMany({
      where: { payment_id: parseInt(paymentId) },
      orderBy: {
        refunded_at: "desc",
      },
    });

    return refunds;
  } catch (error) {
    throw new Error(`Error fetching refunds: ${error.message}`);
  }
};

module.exports = {
  createPayment,
  getPaymentById,
  getPaymentsByOrder,
  updatePaymentStatus,
  createRefund,
  getRefundsByPayment,
  addPaymentProof
};