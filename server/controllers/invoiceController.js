const invoiceModel = require("../models/invoice");

// Get invoice by ID
const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.type === "admin";

    const invoice = await invoiceModel.getInvoiceById(id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    // Check ownership (unless admin)
    if (!isAdmin && invoice.order.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this invoice",
      });
    }

    res.json({
      success: true,
      data: invoice,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get invoice by invoice number
const getInvoiceByNumber = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.type === "admin";

    const invoice = await invoiceModel.getInvoiceByNumber(invoiceNumber);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    // Check ownership (unless admin)
    if (!isAdmin && invoice.order.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this invoice",
      });
    }

    res.json({
      success: true,
      data: invoice,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get invoices by order ID
const getInvoicesByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.type === "admin";

    const invoices = await invoiceModel.getInvoicesByOrder(orderId);

    if (invoices.length > 0) {
      // Check ownership from first invoice
      if (!isAdmin && invoices[0].order.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to view these invoices",
        });
      }
    }

    res.json({
      success: true,
      data: invoices,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Create invoice for order (admin only)
const createInvoice = async (req, res) => {
  try {
    const {
      order_id,
      invoice_number,
      issued_at,
      due_at,
      subtotal,
      shipping_cost,
      discount_amount,
      tax_amount,
      grand_total,
      items,
    } = req.body;

    // Validation
    if (!order_id || !subtotal || !grand_total || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order ID, subtotal, grand total, and items are required",
      });
    }

    const invoice = await invoiceModel.createInvoice({
      order_id,
      invoice_number,
      issued_at,
      due_at,
      subtotal,
      shipping_cost,
      discount_amount,
      tax_amount,
      grand_total,
      items,
    });

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getInvoiceById,
  getInvoiceByNumber,
  getInvoicesByOrder,
  createInvoice,
};