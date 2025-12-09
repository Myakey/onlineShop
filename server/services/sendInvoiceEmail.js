const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send invoice email to customer
 * @param {Object} invoiceData - Complete invoice data with order details
 * @param {string} customerEmail - Customer's email address
 * @param {string} customerName - Customer's full name
 */
const sendInvoiceEmail = async (invoiceData, customerEmail, customerName) => {
  try {
    const {
      invoice_number,
      order_number,
      issued_at,
      due_at,
      subtotal,
      shipping_cost,
      discount_amount,
      tax_amount,
      grand_total,
      amount_paid,
      balance_due,
      status,
      items = [],
      shipping_address = {},
      payment_info = {}
    } = invoiceData;

    // Format currency
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(amount);
    };

    // Format date
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    // Generate items HTML
    const itemsHTML = items.map((item, index) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 15px 10px; color: #374151; text-align: center;">${index + 1}</td>
        <td style="padding: 15px 10px; color: #374151;">
          <strong>${item.product_name || 'Product'}</strong>
        </td>
        <td style="padding: 15px 10px; color: #374151; text-align: center;">${item.quantity}</td>
        <td style="padding: 15px 10px; color: #374151; text-align: right;">${formatCurrency(item.price)}</td>
        <td style="padding: 15px 10px; color: #374151; text-align: right; font-weight: 600;">${formatCurrency(item.subtotal)}</td>
      </tr>
    `).join('');

    const html = `
      <div style="margin: 0; padding: 0; background: linear-gradient(135deg, #fce7f3 0%, #e0f2fe 100%); font-family: 'Segoe UI', Arial, sans-serif;">
        <div style="max-width: 700px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(236, 72, 153, 0.15);">

          <!-- Header with gradient -->
          <div style="background: linear-gradient(135deg, #f9a8d4 0%, #67e8f9 100%); padding: 40px 30px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold; text-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  Monmon's Hobby Shop
                </h1>
                <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">
                  Your Plushie Paradise 🧸
                </p>
              </div>
              <div style="background: white; padding: 15px 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <p style="color: #6b7280; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Invoice</p>
                <p style="color: #ec4899; font-size: 20px; font-weight: bold; margin: 5px 0 0 0;">#${invoice_number}</p>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px;">

            <!-- Status Badge -->
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="display: inline-block; background: ${status === 'paid' ? '#d1fae5' : '#fef3c7'}; color: ${status === 'paid' ? '#065f46' : '#92400e'}; padding: 10px 30px; border-radius: 50px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                ${status === 'paid' ? '✓ PAID' : '⏳ ' + status.toUpperCase()}
              </div>
            </div>

            <!-- Customer Info -->
            <div style="margin-bottom: 30px;">
              <h2 style="color: #ec4899; font-size: 24px; margin: 0 0 20px 0;">
                Hi ${customerName}! 👋
              </h2>
              <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0;">
                Thank you for your purchase! Here's your invoice for order <strong style="color: #374151;">#${order_number}</strong>.
              </p>
            </div>

            <!-- Invoice Details Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; background: #f9fafb; padding: 25px; border-radius: 16px;">
              <div>
                <p style="color: #6b7280; font-size: 12px; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1px;">Issue Date</p>
                <p style="color: #374151; font-size: 15px; font-weight: 600; margin: 0;">${formatDate(issued_at)}</p>
              </div>
              <div>
                <p style="color: #6b7280; font-size: 12px; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1px;">Due Date</p>
                <p style="color: #374151; font-size: 15px; font-weight: 600; margin: 0;">${due_at ? formatDate(due_at) : 'Paid'}</p>
              </div>
              <div>
                <p style="color: #6b7280; font-size: 12px; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1px;">Order Number</p>
                <p style="color: #374151; font-size: 15px; font-weight: 600; margin: 0;">#${order_number}</p>
              </div>
              <div>
                <p style="color: #6b7280; font-size: 12px; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1px;">Payment Method</p>
                <p style="color: #374151; font-size: 15px; font-weight: 600; margin: 0;">${payment_info.method || 'Bank Transfer'}</p>
              </div>
            </div>

            <!-- Shipping Address -->
            ${shipping_address.recipient_name ? `
            <div style="background: #f0fdfa; padding: 20px; border-radius: 12px; margin-bottom: 30px; border-left: 4px solid #67e8f9;">
              <p style="color: #0891b2; font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">📦 Shipping Address</p>
              <p style="color: #374151; font-size: 15px; margin: 0; line-height: 1.6;">
                <strong>${shipping_address.recipient_name}</strong><br>
                ${shipping_address.phone_number || ''}<br>
                ${shipping_address.street_address || ''}<br>
                ${shipping_address.district ? shipping_address.district + ', ' : ''}${shipping_address.city || ''}<br>
                ${shipping_address.province || ''} ${shipping_address.postal_code || ''}
              </p>
            </div>
            ` : ''}

            <!-- Items Table -->
            <h3 style="color: #374151; font-size: 18px; margin: 0 0 15px 0;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
              <thead>
                <tr style="background: linear-gradient(135deg, #fce7f3 0%, #e0f2fe 100%);">
                  <th style="padding: 15px 10px; text-align: center; color: #374151; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">#</th>
                  <th style="padding: 15px 10px; text-align: left; color: #374151; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Item</th>
                  <th style="padding: 15px 10px; text-align: center; color: #374151; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Qty</th>
                  <th style="padding: 15px 10px; text-align: right; color: #374151; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Price</th>
                  <th style="padding: 15px 10px; text-align: right; color: #374151; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>

            <!-- Totals Section -->
            <div style="background: #f9fafb; padding: 25px; border-radius: 16px; margin-bottom: 30px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #6b7280; font-size: 15px;">Subtotal</span>
                <span style="color: #374151; font-size: 15px; font-weight: 600;">${formatCurrency(subtotal)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #6b7280; font-size: 15px;">Shipping Cost</span>
                <span style="color: #374151; font-size: 15px; font-weight: 600;">${formatCurrency(shipping_cost)}</span>
              </div>
              ${discount_amount > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #10b981; font-size: 15px;">Discount</span>
                <span style="color: #10b981; font-size: 15px; font-weight: 600;">-${formatCurrency(discount_amount)}</span>
              </div>
              ` : ''}
              ${tax_amount > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #6b7280; font-size: 15px;">Tax</span>
                <span style="color: #374151; font-size: 15px; font-weight: 600;">${formatCurrency(tax_amount)}</span>
              </div>
              ` : ''}
              <div style="border-top: 2px solid #e5e7eb; margin: 15px 0; padding-top: 15px; display: flex; justify-content: space-between;">
                <span style="color: #374151; font-size: 18px; font-weight: bold;">Grand Total</span>
                <span style="color: #ec4899; font-size: 24px; font-weight: bold;">${formatCurrency(grand_total)}</span>
              </div>
              ${balance_due > 0 ? `
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #f59e0b;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #92400e; font-size: 15px; font-weight: 600;">Balance Due</span>
                  <span style="color: #92400e; font-size: 18px; font-weight: bold;">${formatCurrency(balance_due)}</span>
                </div>
              </div>
              ` : `
              <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin-top: 15px; text-align: center;">
                <p style="color: #065f46; font-size: 15px; font-weight: 600; margin: 0;">✓ Fully Paid - Thank You!</p>
              </div>
              `}
            </div>

            <!-- Thank You Message -->
            <div style="text-align: center; padding: 30px 0;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">
                Thank you for shopping with <strong style="color: #ec4899;">Monmon's Hobby Shop</strong>! 💕
              </p>
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                We hope you enjoy your adorable plushies!
              </p>
            </div>

            <!-- Contact Info -->
            <div style="background: #f0fdfa; padding: 20px; border-radius: 12px; text-align: center;">
              <p style="color: #0891b2; font-size: 14px; margin: 0 0 5px 0; font-weight: 600;">Need Help?</p>
              <p style="color: #374151; font-size: 14px; margin: 0;">
                Contact us at <a href="mailto:support@ambalabus.my.id" style="color: #ec4899; text-decoration: none; font-weight: 600;">support@ambalabus.my.id</a>
              </p>
            </div>

          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 15px 0;">
              Questions about your invoice? We're here to help!
            </p>
            <div style="margin: 20px 0;">
              <a href="#" style="display: inline-block; margin: 0 8px; color: #ec4899; text-decoration: none;">
                <svg style="width: 24px; height: 24px;" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557a9.93 9.93 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.38 4.482A13.944 13.944 0 011.671 3.149a4.916 4.916 0 001.523 6.556 4.9 4.9 0 01-2.228-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.085 4.918 4.918 0 004.59 3.417 9.867 9.867 0 01-6.102 2.104c-.396 0-.787-.023-1.175-.068A13.933 13.933 0 007.548 21c9.142 0 14.307-7.721 13.995-14.646A9.936 9.936 0 0024 4.557z" />
                </svg>
              </a>
              <a href="#" style="display: inline-block; margin: 0 8px; color: #ec4899; text-decoration: none;">
                <svg style="width: 24px; height: 24px;" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.335 3.608 1.31.975.975 1.247 2.243 1.31 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.335 2.633-1.31 3.608-.975.975-2.243 1.247-3.608 1.31-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.335-3.608-1.31-.975-.975-1.247-2.243-1.31-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.335-2.633 1.31-3.608C4.518 2.568 5.786 2.296 7.152 2.234 8.418 2.175 8.798 2.163 12 2.163zm0-2.163C8.756 0 8.333.014 7.052.072 5.775.13 4.623.437 3.68 1.38 2.737 2.323 2.43 3.475 2.372 4.752.014 8.333 0 8.756 0 12s.014 3.667.072 4.948c.058 1.277.365 2.429 1.308 3.372.943.943 2.095 1.25 3.372 1.308C8.333 23.986 8.756 24 12 24s3.667-.014 4.948-.072c1.277-.058 2.429-.365 3.372-1.308.943-.943 1.25-2.095 1.308-3.372C23.986 15.667 24 15.244 24 12s-.014-3.667-.072-4.948c-.058-1.277-.365-2.429-1.308-3.372-.943-.943-2.095-1.25-3.372-1.308C15.667.014 15.244 0 12 0z" />
                  <path d="M12 5.838A6.162 6.162 0 105.838 12 6.169 6.169 0 0012 5.838zm0 10.162A3.998 3.998 0 118 12a3.998 3.998 0 014 4z" />
                  <circle cx="18.406" cy="5.594" r="1.44" />
                </svg>
              </a>
            </div>
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              This is an automated invoice. Please do not reply to this email.
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 15px 0 0 0;">
              © 2025 Monmon's Hobby Shop. All rights reserved.<br>
              Jl. Teratai II C21/24, Kel. Uwung Jaya, Kec. Cibodas, Kota Tangerang, 15138
            </p>
          </div>

        </div>
      </div>
    `;

    const result = await resend.emails.send({
      from: "Monmon's Hobbyshop <invoice@ambalabus.my.id>",
      to: customerEmail,
      subject: `Invoice #${invoice_number} - Order #${order_number}`,
      html
    });

    console.log("✅ Invoice email sent successfully!", result.id);
    return { success: true, messageId: result.id };

  } catch (error) {
    console.error("❌ Error sending invoice email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendInvoiceEmail };