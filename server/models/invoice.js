const prisma = require("../config/prisma");

const generateInvoiceNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `INV-${timestamp}-${random}`;
};

// Create invoice for order
const createInvoice = async (invoiceData) => {
  try {
    const {
      order_id,
      invoice_number,
      issued_at = new Date(), 
      due_at,
      subtotal,
      shipping_cost,
      discount_amount = 0,
      tax_amount = 0,
      grand_total,
      items = [],
    } = invoiceData;

    const invoice = await prisma.$transaction(async (tx) => {
      // Create invoice
      const newInvoice = await tx.invoices.create({
        data: {
          order_id: parseInt(order_id),
          invoice_number: invoice_number || generateInvoiceNumber(),
          issued_at,
          due_at,
          subtotal: parseFloat(subtotal),
          shipping_cost: parseFloat(shipping_cost),
          discount_amount: parseFloat(discount_amount),
          tax_amount: parseFloat(tax_amount),
          grand_total: parseFloat(grand_total),
          amount_paid: 0,
          balance_due: parseFloat(grand_total),
          status: "unpaid",
        },
      });

      // Create invoice items
      if (items.length > 0) {
        const invoiceItems = items.map((item) => ({
          invoice_id: newInvoice.invoice_id,
          product_id: parseInt(item.product_id),
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price),
          subtotal: parseFloat(item.price) * parseInt(item.quantity),
        }));

        await tx.invoice_items.createMany({
          data: invoiceItems,
        });
      }

      return newInvoice;
    });

    // Fetch complete invoice with relations
    return await getInvoiceById(invoice.invoice_id);
  } catch (error) {
    throw new Error(`Error creating invoice: ${error.message}`);
  }
};

// Get invoice by ID
const getInvoiceById = async (invoiceId) => {
  try {
    const invoice = await prisma.invoices.findUnique({
      where: { invoice_id: parseInt(invoiceId) },
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
            address: true,
          },
        },
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { is_primary: true },
                  take: 1,
                },
              },
            },
          },
        },
        payments: true,
      },
    });

    return invoice;
  } catch (error) {
    throw new Error(`Error fetching invoice: ${error.message}`);
  }
};

// Get invoice by invoice number
const getInvoiceByNumber = async (invoiceNumber) => {
  try {
    const invoice = await prisma.invoices.findUnique({
      where: { invoice_number: invoiceNumber },
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
            address: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });

    return invoice;
  } catch (error) {
    throw new Error(`Error fetching invoice: ${error.message}`);
  }
};

// Get invoices by order ID
const getInvoicesByOrder = async (orderId) => {
  try {
    const invoices = await prisma.invoices.findMany({
      where: { order_id: parseInt(orderId) },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return invoices;
  } catch (error) {
    throw new Error(`Error fetching invoices: ${error.message}`);
  }
};

// Update invoice status when payment is made
const updateInvoicePayment = async (invoiceId, paymentAmount) => {
  try {
    const invoice = await prisma.invoices.findUnique({
      where: { invoice_id: parseInt(invoiceId) },
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const newAmountPaid =
      parseFloat(invoice.amount_paid) + parseFloat(paymentAmount);
    const newBalanceDue = parseFloat(invoice.grand_total) - newAmountPaid;
    const newStatus =
      newBalanceDue <= 0 ? "paid" : newBalanceDue < invoice.grand_total ? "partial" : "unpaid";

    const updatedInvoice = await prisma.invoices.update({
      where: { invoice_id: parseInt(invoiceId) },
      data: {
        amount_paid: newAmountPaid,
        balance_due: newBalanceDue,
        status: newStatus,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });

    return updatedInvoice;
  } catch (error) {
    throw new Error(`Error updating invoice payment: ${error.message}`);
  }
};

module.exports = {
  createInvoice,
  getInvoiceById,
  getInvoiceByNumber,
  getInvoicesByOrder,
  updateInvoicePayment,
  generateInvoiceNumber,
};