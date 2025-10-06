// services/emailService.js
const nodemailer = require('nodemailer');

// ==============================
// 🔧 Create reusable transporter
// ==============================
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // Use Gmail App Password, not the main password
    },
  });
};

// ==============================
// 🔢 Generate 6-digit OTP
// ==============================
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ==============================
// 📧 Send OTP email
// ==============================
const sendOTPEmail = async (email, otp, purpose = 'email_verification') => {
  try {
    const transporter = createTransporter();

    let subject, html;

    switch (purpose) {
      case 'email_verification':
        subject = 'Verify Your Email Address';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h2 style="color: #333; text-align: center;">Email Verification</h2>
            <p>Hello,</p>
            <p>Use the OTP below to verify your email address:</p>
            <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #2563eb; font-size: 2em; letter-spacing: 3px;">${otp}</h1>
            </div>
            <p>This OTP will expire in 10 minutes.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 0.9em;">This is an automated email. Please do not reply.</p>
          </div>
        `;
        break;

      case 'password_reset':
        subject = 'Password Reset Request';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h2 style="color: #dc2626; text-align: center;">Password Reset</h2>
            <p>Hello,</p>
            <p>You have requested to reset your password. Use this OTP:</p>
            <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #dc2626; font-size: 2em; letter-spacing: 3px;">${otp}</h1>
            </div>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn’t request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 0.9em;">This is an automated email. Please do not reply.</p>
          </div>
        `;
        break;

      default:
        subject = 'Your Verification Code';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h2 style="text-align: center;">Verification Code</h2>
            <p>Your code is:</p>
            <div style="background: #f4f4f4; padding: 20px; text-align: center;">
              <h1 style="color: #2563eb;">${otp}</h1>
            </div>
            <p>This code will expire in 10 minutes.</p>
          </div>
        `;
    }

    const mailOptions = {
      from: {
        name: 'AmbatuGroup',
        address: process.env.GMAIL_USER,
      },
      to: email,
      subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
};

// ==============================
// 🎉 Send Welcome Email
// ==============================
const sendWelcomeEmail = async (email, firstName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: 'AmbatuGroup',
        address: process.env.GMAIL_USER,
      },
      to: email,
      subject: 'Welcome to AmbatuGroup!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #2563eb; text-align: center;">Welcome ${firstName}!</h2>
          <p>Your email has been successfully verified. You can now enjoy all the features of our platform.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
              Start Shopping
            </a>
          </div>
          <p>Thank you for choosing AmbatuGroup 💖</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', email);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// ==============================
// 💰 Send Payment Confirmation Email
// ==============================
const sendPaymentConfirmationEmail = async (orderData, userEmail) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: 'AmbatuGroup Store',
        address: process.env.GMAIL_USER,
      },
      to: userEmail,
      subject: `Payment Confirmed - Order #${orderData.order_number}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #4CAF50; text-align: center;">Payment Confirmed ✅</h2>
          <p>Dear Customer,</p>
          <p>Your payment for order <strong>#${orderData.order_number}</strong> has been successfully processed.</p>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Order Number:</strong> ${orderData.order_number}</p>
            <p><strong>Total Amount:</strong> Rp ${parseFloat(orderData.total_amount || 0).toLocaleString("id-ID")}</p>
            <p><strong>Payment Method:</strong> ${orderData.payment_method}</p>
            <p><strong>Status:</strong> ${orderData.payment_status}</p>
          </div>

          <p>We’ll notify you once your order is shipped 🚚</p>
          <p>Thank you for shopping with us!</p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">If you have any questions, please contact our support team.</p>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Payment confirmation email sent for Order #${orderData.order_number}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending payment confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// ==============================
// 📤 Export all utilities
// ==============================
module.exports = {
  generateOTP,
  sendOTPEmail,
  sendWelcomeEmail,
  sendPaymentConfirmationEmail,
};
