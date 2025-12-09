// models/invoiceModel.js
const prisma = require("../config/prisma");

// Generate unique invoice number
const generateInvoiceNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${timestamp}-${random}`;
};

// Calculate invoice totals from order
const calculateInvoiceTotals = async (orderId) => {
  const order = await prisma.orders.findUnique({
    where: { order_id: parseInt(orderId) },
    include: {
      items: {
        include: {
          product: true
        }
      },
      shipping_method: true,
      promocode: true
    }
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // Calculate subtotal from order items
  const subtotal = order.items.reduce((sum, item) => {
    return sum + parseFloat(item.subtotal);
  }, 0);

  // Get shipping cost
  const shipping_cost = order.shipping_method 
    ? parseFloat(order.shipping_method.base_cost) 
    : 0;

  // Calculate discount
  let discount_amount = 0;
  if (order.promocode) {
    if (order.promocode.discount_type === 'percentage') {
      discount_amount = (subtotal * parseFloat(order.promocode.discount_value)) / 100;
    } else if (order.promocode.discount_type === 'fixed') {
      discount_amount = parseFloat(order.promocode.discount_value);
    }
  }

  // Calculate tax (e.g., 10% PPN - adjust as needed)
  const tax_rate = 0; // Set to 0.10 for 10% tax if needed
  const tax_amount = (subtotal + shipping_cost - discount_amount) * tax_rate;

  // Calculate grand total
  const grand_total = subtotal + shipping_cost + tax_amount - discount_amount;

  return {
    subtotal,
    shipping_cost,
    discount_amount,
    tax_amount,
    grand_total
  };
};

// Create invoice for an order
const createInvoice = async (orderId) => {
  try {
    // Check if invoice already exists
    const existingInvoice = await prisma.invoices.findFirst({
      where: { order_id: parseInt(orderId) }
    });

    if (existingInvoice) {
      throw new Error('Invoice already exists for this order');
    }

    // Get order details
    const order = await prisma.orders.findUnique({
      where: { order_id: parseInt(orderId) },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true,
        address: true,
        shipping_method: true,
        promocode: true
      }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Calculate totals
    const totals = await calculateInvoiceTotals(orderId);

    // Create invoice
    const invoice = await prisma.invoices.create({
      data: {
        order_id: parseInt(orderId),
        invoice_number: generateInvoiceNumber(),
        issued_at: new Date(),
        due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        subtotal: totals.subtotal,
        shipping_cost: totals.shipping_cost,
        discount_amount: totals.discount_amount,
        tax_amount: totals.tax_amount,
        grand_total: totals.grand_total,
        amount_paid: 0,
        balance_due: totals.grand_total,
        status: 'pending'
      }
    });

    // Create invoice items
    const invoiceItems = order.items.map(item => ({
      invoice_id: invoice.invoice_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal
    }));

    await prisma.invoice_items.createMany({
      data: invoiceItems
    });

    // Return complete invoice with relations
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
                phone_number: true
              }
            },
            address: true,
            shipping_method: true,
            promocode: true
          }
        },
        items: {
          include: {
            product: {
              include: {
                images: true
              }
            }
          }
        },
        payments: {
          include: {
            payment_methods: true
          }
        }
      }
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
                phone_number: true
              }
            },
            address: true,
            shipping_method: true,
            promocode: true
          }
        },
        items: {
          include: {
            product: {
              include: {
                images: true
              }
            }
          }
        },
        payments: {
          include: {
            payment_methods: true
          }
        }
      }
    });

    return invoice;
  } catch (error) {
    throw new Error(`Error fetching invoice by number: ${error.message}`);
  }
};

// Get all invoices for an order
const getInvoicesByOrder = async (orderId) => {
  try {
    const invoices = await prisma.invoices.findMany({
      where: { order_id: parseInt(orderId) },
      include: {
        items: {
          include: {
            product: true
          }
        },
        payments: {
          include: {
            payment_methods: true
          }
        }
      },
      orderBy: {
        issued_at: 'desc'
      }
    });

    return invoices;
  } catch (error) {
    throw new Error(`Error fetching invoices for order: ${error.message}`);
  }
};

// Get all invoices (admin)
const getAllInvoices = async () => {
  try {
    const invoices = await prisma.invoices.findMany({
      include: {
        order: {
          include: {
            user: {
              select: {
                user_id: true,
                username: true,
                email: true,
                first_name: true,
                last_name: true
              }
            }
          }
        },
        items: {
          include: {
            product: true
          }
        },
        payments: true
      },
      orderBy: {
        issued_at: 'desc'
      }
    });

    return invoices;
  } catch (error) {
    throw new Error(`Error fetching all invoices: ${error.message}`);
  }
};

// Update invoice payment
const updateInvoicePayment = async (invoiceId, paymentAmount) => {
  try {
    const invoice = await prisma.invoices.findUnique({
      where: { invoice_id: parseInt(invoiceId) }
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    const newAmountPaid = parseFloat(invoice.amount_paid) + parseFloat(paymentAmount);
    const newBalanceDue = parseFloat(invoice.grand_total) - newAmountPaid;
    const newStatus = newBalanceDue <= 0 ? 'paid' : 'partially_paid';

    const updatedInvoice = await prisma.invoices.update({
      where: { invoice_id: parseInt(invoiceId) },
      data: {
        amount_paid: newAmountPaid,
        balance_due: newBalanceDue > 0 ? newBalanceDue : 0,
        status: newStatus
      }
    });

    return updatedInvoice;
  } catch (error) {
    throw new Error(`Error updating invoice payment: ${error.message}`);
  }
};

// Update invoice status
const updateInvoiceStatus = async (invoiceId, status) => {
  try {
    const validStatuses = ['pending', 'paid', 'partially_paid', 'overdue', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const updatedInvoice = await prisma.invoices.update({
      where: { invoice_id: parseInt(invoiceId) },
      data: { status }
    });

    return updatedInvoice;
  } catch (error) {
    throw new Error(`Error updating invoice status: ${error.message}`);
  }
};

// Format invoice data for email - SAFE VERSION
const formatInvoiceForEmail = async (invoiceId) => {
  try {
    const invoice = await getInvoiceById(invoiceId);

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    // ✅ Safely format items for email
    const items = (invoice.items || []).map(item => ({
      product_name: item.product?.name || 'Unknown Product',
      quantity: item.quantity || 0,
      price: item.price || 0,
      subtotal: item.subtotal || 0
    }));

    // ✅ Safely format shipping address
    const address = invoice.order?.address || {};
    const shipping_address = {
      recipient_name: address.recipient_name || '',
      phone_number: address.phone_number || '',
      street_address: address.street_address || '',
      district: address.district || '',
      city: address.city || '',
      province: address.province || '',
      postal_code: address.postal_code || ''
    };

    // ✅ Safely get payment method
    let paymentMethod = 'Pending';
    if (invoice.payments && invoice.payments.length > 0) {
      const firstPayment = invoice.payments[0];
      if (firstPayment.payment_methods && firstPayment.payment_methods.length > 0) {
        paymentMethod = firstPayment.payment_methods[0].method_name || 'Bank Transfer';
      }
    }

    const payment_info = {
      method: paymentMethod
    };

    return {
      invoice_number: invoice.invoice_number,
      order_number: invoice.order?.order_number || 'N/A',
      issued_at: invoice.issued_at,
      due_at: invoice.due_at,
      subtotal: invoice.subtotal,
      shipping_cost: invoice.shipping_cost,
      discount_amount: invoice.discount_amount,
      tax_amount: invoice.tax_amount,
      grand_total: invoice.grand_total,
      amount_paid: invoice.amount_paid,
      balance_due: invoice.balance_due,
      status: invoice.status,
      items,
      shipping_address,
      payment_info
    };
  } catch (error) {
    throw new Error(`Error formatting invoice for email: ${error.message}`);
  }
};

module.exports = {
  createInvoice,
  getInvoiceById,
  getInvoiceByNumber,
  getInvoicesByOrder,
  getAllInvoices,
  updateInvoicePayment,
  updateInvoiceStatus,
  formatInvoiceForEmail,
  generateInvoiceNumber
};