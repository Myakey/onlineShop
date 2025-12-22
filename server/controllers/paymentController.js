const paymentModel = require("../models/payment");
const orderModel = require("../models/orderModel");
const invoiceModel = require("../models/invoice");
const { cleanupCloudinaryFile } = require("../middleware/uploadPaymentProof");
const { sendInvoiceEmail } = require("../services/sendInvoiceEmail")
const prisma = require("../config/prisma");

// Get payment by ID
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.type === "admin";

    const payment = await paymentModel.getPaymentById(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Check ownership (unless admin)
    if (!isAdmin && payment.order.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this payment",
      });
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get payments by order ID
const getPaymentsByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.type === "admin";

    const payments = await paymentModel.getPaymentsByOrder(orderId);

    // Check ownership if payments exist
    if (payments.length > 0) {
      const firstPayment = payments[0];
      if (!isAdmin && firstPayment.order.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to view these payments",
        });
      }
    }

    res.json({
      success: true,
      data: payments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Create payment with full details
const createPayment = async (req, res) => {
  try {
    const {
      order_id,
      invoice_id,
      payment_amount,
      payment_type,
      payment_status = "unpaid",
      paid_at,
      // Payment method details
      method_name,
      payment_channel,
      bank_account_name,
      bank_account_number,
      // Marketplace details
      marketplace_order_id,
      marketplace_item_id,
      marketplace_fee_amount,
    } = req.body;

    // Validation
    if (!order_id || !payment_amount || !payment_type) {
      return res.status(400).json({
        success: false,
        message: "Order ID, payment amount, and payment type are required",
      });
    }

    const payment = await paymentModel.createPayment({
      order_id,
      invoice_id,
      payment_amount,
      payment_type,
      payment_status,
      paid_at,
      method_name,
      payment_channel,
      bank_account_name,
      bank_account_number,
      marketplace_order_id,
      marketplace_item_id,
      marketplace_fee_amount,
    });

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: payment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const uploadPaymentProof = async (req, res) => {
  let uploadedPublicId = req.uploadedProof?.public_id;

  try {
    const { id } = req.params; // payment_id
    const userId = req.user.id;
    const isAdmin = req.user.type === "admin";

    // ✅ CHECK if uploadedProof exists
    if (!req.uploadedProof) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded or upload failed",
      });
    }

    const payment = await paymentModel.getPaymentById(id);

    if (!payment) {
      await cleanupCloudinaryFile(uploadedPublicId);
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (!isAdmin && payment.order.user_id !== userId) {
      await cleanupCloudinaryFile(uploadedPublicId);
      return res.status(403).json({
        success: false,
        message: "You don't have permission to upload proof for this payment",
      });
    }

    const { url } = req.uploadedProof;

    const proof = await paymentModel.addPaymentProof({
      payment_id: Number(id),
      image_url: url,
      // Remove cloudinary_id since it's not in your schema
    });

    res.json({
      success: true,
      message: "Payment proof uploaded successfully",
      data: proof,
    });

  } catch (err) {
    // Clean Cloudinary on ANY unexpected error
    await cleanupCloudinaryFile(uploadedPublicId);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update payment status (admin only)
// Update payment status (admin only)
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status, paid_at } = req.body;

    const validStatuses = ["unpaid", "paid", "refunded", "failed"];

    if (!payment_status || !validStatuses.includes(payment_status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // Update payment status
    const payment = await paymentModel.updatePaymentStatus(id, payment_status, paid_at);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // ===== 🔥 NEW LOGIC: When payment confirmed =====
    if (payment_status === "paid") {
      const paymentInfo = await paymentModel.getPaymentById(id);

      const order = await orderModel.getOrderById(paymentInfo.order_id);

      for (const item of order.items) {
        await prisma.products.update({
          where: { product_id: item.product_id },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      // 1️⃣ Update related order → confirmed
      await orderModel.updateOrderStatus(paymentInfo.order_id, "confirmed");
      console.log("✅ Order status updated to confirmed");

      // 2️⃣ Create invoice if it doesn't exist
      try {
        const existingInvoices = await invoiceModel.getInvoicesByOrder(paymentInfo.order_id);
        
        let invoice;
        if (existingInvoices.length === 0) {
          // Create new invoice
          invoice = await invoiceModel.createInvoice(paymentInfo.order_id);
          console.log("✅ Invoice created:", invoice.invoice_number);

          // Update invoice payment
          await invoiceModel.updateInvoicePayment(
            invoice.invoice_id, 
            paymentInfo.payment_amount
          );
        } else {
          // Use existing invoice
          invoice = existingInvoices[0];
          console.log("✅ Using existing invoice:", invoice.invoice_number);

          // Update invoice payment
          await invoiceModel.updateInvoicePayment(
            invoice.invoice_id, 
            paymentInfo.payment_amount
          );
        }

        // 3️⃣ Format invoice data for email
        const invoiceData = await invoiceModel.formatInvoiceForEmail(invoice.invoice_id);

        // Get customer info from order
        const orderDetails = await orderModel.getOrderById(paymentInfo.order_id);
        
        // ✅ Validate order details exist
        if (!orderDetails || !orderDetails.user) {
          throw new Error('Order or user details not found');
        }

        const customerEmail = orderDetails.user.email;
        const customerName = `${orderDetails.user.first_name || ''} ${orderDetails.user.last_name || ''}`.trim() || 'Customer';

        // 4️⃣ Send invoice email
        const emailResult = await sendInvoiceEmail(
          invoiceData,
          customerEmail,
          customerName
        );

        if (emailResult.success) {
          console.log("✅ Invoice email sent successfully");
        } else {
          console.error("❌ Failed to send invoice email:", emailResult.error);
        }

      } catch (invoiceError) {
        // Log error but don't fail the payment update
        console.error("❌ Error creating/sending invoice:", invoiceError.message);
      }
    }

    res.json({
      success: true,
      message: "Payment status updated successfully",
      data: payment,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// Create refund (admin only)
const createRefund = async (req, res) => {
  try {
    const { payment_id, refund_amount, refund_reason } = req.body;

    if (!payment_id || !refund_amount) {
      return res.status(400).json({
        success: false,
        message: "Payment ID and refund amount are required",
      });
    }

    const refund = await paymentModel.createRefund({
      payment_id,
      refund_amount,
      refund_reason,
    });

    res.status(201).json({
      success: true,
      message: "Refund processed successfully",
      data: refund,
    });
  } catch (err) {
    if (err.message.includes("not found") || err.message.includes("only refund")) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get refunds by payment ID
const getRefundsByPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const refunds = await paymentModel.getRefundsByPayment(paymentId);

    res.json({
      success: true,
      data: refunds,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  uploadPaymentProof,
  getPaymentById,
  getPaymentsByOrder,
  createPayment,
  updatePaymentStatus,
  createRefund,
  getRefundsByPayment,
};