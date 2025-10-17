// services/emailService.js
const nodemailer = require("nodemailer");

// ==============================
// 🔧 Create reusable transporter
// ==============================
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
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
const sendOTPEmail = async (email, otp, purpose = "email_verification") => {
  try {
    const transporter = createTransporter();

    let subject, html;

    switch (purpose) {
      case "email_verification":
        subject = "Verify Your Email Address";
        html = `
          <div style="margin: 0; padding: 0; background: linear-gradient(135deg, #fce7f3 0%, #e0f2fe 100%); font-family: 'Segoe UI', Arial, sans-serif;">
                      <div
            style="max-width: 600px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(236, 72, 153, 0.15);">

            <!-- Header with gradient -->
            <div style="background: linear-gradient(135deg, #f9a8d4 0%, #67e8f9 100%); padding: 40px 30px; text-align: center;">
              <div
                style="background: white; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <svg style="width: 40px; height: 40px; color: #ec4899;" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold; text-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                DollStore
              </h1>
            </div>

            <!-- Main Content -->
            <div style="padding: 40px 30px;">

              <!-- Lock Icon -->
              <div style="text-align: center; margin-bottom: 30px;">
                <div
                  style="background: linear-gradient(135deg, #a78bfa 0%, #c084fc 100%); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(167, 139, 250, 0.4);">
                  <span style="font-size: 40px;">🔒</span>
                </div>
              </div>

              <h2 style="color: #ec4899; text-align: center; font-size: 28px; margin: 0 0 10px 0;">
                Email Verification
              </h2>
              <p style="text-align: center; color: #6b7280; font-size: 16px; margin: 0 0 30px 0;">
                Verify your account to continue 🎉
              </p>

              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Hello!
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Welcome to DollStore! Use the OTP code below to verify your email address and start shopping for adorable
                plushies.
              </p>

              <!-- OTP Card -->
              <div
                style="background: linear-gradient(135deg, #fce7f3 0%, #e0f2fe 100%); padding: 30px; border-radius: 16px; margin: 30px 0; text-align: center; border: 2px dashed #ec4899;">
                <p
                  style="color: #6b7280; font-size: 14px; margin: 0 0 15px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                  Your Verification Code
                </p>
                <div
                  style="background: white; padding: 20px; border-radius: 12px; margin: 0 auto; display: inline-block; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                  <h1
                    style="color: #ec4899; font-size: 48px; letter-spacing: 8px; margin: 0; font-weight: bold; text-shadow: 2px 2px 4px rgba(236, 72, 153, 0.1);">
                    ${otp}
                  </h1>
                </div>
              </div>

              <!-- Timer Warning -->
              <div
                style="background: #fef3c7; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #f59e0b; display: flex; align-items: start; gap: 15px;">
                <div style="font-size: 24px; line-height: 1;">⏰</div>
                <div>
                  <p style="color: #92400e; font-size: 15px; margin: 0; line-height: 1.6;">
                    <strong>Important:</strong> This OTP will expire in <strong>10 minutes</strong>. Please verify your email as
                    soon as possible.
                  </p>
                </div>
              </div>

              <!-- Security Notice -->
              <div
                style="background: #f0fdfa; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #67e8f9;">
                <p style="color: #0891b2; font-size: 14px; margin: 0; line-height: 1.6;">
                  🛡️ <strong>Security Tip:</strong> Never share this code with anyone. DollStore will never ask for your OTP
                  via phone or email.
                </p>
              </div>

              <p style="color: #374151; font-size: 16px; line-height: 1.6; text-align: center; margin: 30px 0 20px 0;">
                Thank you for joining <strong style="color: #ec4899;">DollStore</strong>! 💕
              </p>

            </div>

            <!-- Footer -->
            <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                Need help? Contact our support team
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                This is an automated email. Please do not reply.
              </p>
              <div style="margin: 20px 0;">
                <a href="#" style="display: inline-block; margin: 0 8px; color: #ec4899; text-decoration: none;">
                  <svg style="width: 24px; height: 24px;" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M24 4.557a9.93 9.93 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.38 4.482A13.944 13.944 0 011.671 3.149a4.916 4.916 0 001.523 6.556 4.9 4.9 0 01-2.228-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.085 4.918 4.918 0 004.59 3.417 9.867 9.867 0 01-6.102 2.104c-.396 0-.787-.023-1.175-.068A13.933 13.933 0 007.548 21c9.142 0 14.307-7.721 13.995-14.646A9.936 9.936 0 0024 4.557z" />
                  </svg>
                </a>
                <a href="#" style="display: inline-block; margin: 0 8px; color: #ec4899; text-decoration: none;">
                  <svg style="width: 24px; height: 24px;" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.335 3.608 1.31.975.975 1.247 2.243 1.31 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.335 2.633-1.31 3.608-.975.975-2.243 1.247-3.608 1.31-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.335-3.608-1.31-.975-.975-1.247-2.243-1.31-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.335-2.633 1.31-3.608C4.518 2.568 5.786 2.296 7.152 2.234 8.418 2.175 8.798 2.163 12 2.163zm0-2.163C8.756 0 8.333.014 7.052.072 5.775.13 4.623.437 3.68 1.38 2.737 2.323 2.43 3.475 2.372 4.752.014 8.333 0 8.756 0 12s.014 3.667.072 4.948c.058 1.277.365 2.429 1.308 3.372.943.943 2.095 1.25 3.372 1.308C8.333 23.986 8.756 24 12 24s3.667-.014 4.948-.072c1.277-.058 2.429-.365 3.372-1.308.943-.943 1.25-2.095 1.308-3.372C23.986 15.667 24 15.244 24 12s-.014-3.667-.072-4.948c-.058-1.277-.365-2.429-1.308-3.372-.943-.943-2.095-1.25-3.372-1.308C15.667.014 15.244 0 12 0z" />
                    <path
                      d="M12 5.838A6.162 6.162 0 105.838 12 6.169 6.169 0 0012 5.838zm0 10.162A3.998 3.998 0 118 12a3.998 3.998 0 014 4z" />
                    <circle cx="18.406" cy="5.594" r="1.44" />
                  </svg>
                </a>
              </div>
              <p style="color: #9ca3af; font-size: 12px; margin: 15px 0 0 0;">
                © 2025 DollStore. All rights reserved.<br>
                Jl. Boneka Bahagia No.123, Jakarta
              </p>
            </div>

          </div>
          </div>
        `;
        break;

      case "password_reset":
        subject = "Password Reset Request";
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
        subject = "Your Verification Code";
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
        name: "AmbatuGroup",
        address: process.env.GMAIL_USER,
      },
      to: email,
      subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
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
        name: "AmbatuGroup",
        address: process.env.GMAIL_USER,
      },
      to: email,
      subject: "Welcome to AmbatuGroup!",
      html: `
        <div style="margin: 0; padding: 0; background: linear-gradient(135deg, #fce7f3 0%, #e0f2fe 100%); font-family: 'Segoe UI', Arial, sans-serif;">
              <div
          style="max-width: 600px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(236, 72, 153, 0.15);">

          <!-- Header with gradient -->
          <div style="background: linear-gradient(135deg, #f9a8d4 0%, #67e8f9 100%); padding: 40px 30px; text-align: center;">
            <div
              style="background: white; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <svg style="width: 40px; height: 40px; color: #ec4899;" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold; text-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              DollStore
            </h1>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px;">

            <h2 style="color: #ec4899; text-align: center; font-size: 32px; margin: 0 0 30px 0;">
              Welcome ${firstName}!
            </h2>

            <p style="color: #374151; font-size: 16px; line-height: 1.6; text-align: center; margin: 0 0 30px 0;">
              Your email has been successfully verified. You can now enjoy all the features of our platform.
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login"
                style="display: inline-block; background: linear-gradient(135deg, #f9a8d4 0%, #67e8f9 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);">
                Start Shopping
              </a>
            </div>

            <p style="color: #374151; font-size: 16px; line-height: 1.6; text-align: center; margin: 30px 0 20px 0;">
              Thank you for choosing <strong style="color: #ec4899;">DollStore</strong> 💖
            </p>

          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 15px 0;">
              Need help? Contact our support team
            </p>
            <div style="margin: 20px 0;">
              <a href="#" style="display: inline-block; margin: 0 8px; color: #ec4899; text-decoration: none;">
                <svg style="width: 24px; height: 24px;" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M24 4.557a9.93 9.93 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.38 4.482A13.944 13.944 0 011.671 3.149a4.916 4.916 0 001.523 6.556 4.9 4.9 0 01-2.228-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.085 4.918 4.918 0 004.59 3.417 9.867 9.867 0 01-6.102 2.104c-.396 0-.787-.023-1.175-.068A13.933 13.933 0 007.548 21c9.142 0 14.307-7.721 13.995-14.646A9.936 9.936 0 0024 4.557z" />
                </svg>
              </a>
              <a href="#" style="display: inline-block; margin: 0 8px; color: #ec4899; text-decoration: none;">
                <svg style="width: 24px; height: 24px;" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.335 3.608 1.31.975.975 1.247 2.243 1.31 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.335 2.633-1.31 3.608-.975.975-2.243 1.247-3.608 1.31-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.335-3.608-1.31-.975-.975-1.247-2.243-1.31-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.335-2.633 1.31-3.608C4.518 2.568 5.786 2.296 7.152 2.234 8.418 2.175 8.798 2.163 12 2.163zm0-2.163C8.756 0 8.333.014 7.052.072 5.775.13 4.623.437 3.68 1.38 2.737 2.323 2.43 3.475 2.372 4.752.014 8.333 0 8.756 0 12s.014 3.667.072 4.948c.058 1.277.365 2.429 1.308 3.372.943.943 2.095 1.25 3.372 1.308C8.333 23.986 8.756 24 12 24s3.667-.014 4.948-.072c1.277-.058 2.429-.365 3.372-1.308.943-.943 1.25-2.095 1.308-3.372C23.986 15.667 24 15.244 24 12s-.014-3.667-.072-4.948c-.058-1.277-.365-2.429-1.308-3.372-.943-.943-2.095-1.25-3.372-1.308C15.667.014 15.244 0 12 0z" />
                  <path
                    d="M12 5.838A6.162 6.162 0 105.838 12 6.169 6.169 0 0012 5.838zm0 10.162A3.998 3.998 0 118 12a3.998 3.998 0 014 4z" />
                  <circle cx="18.406" cy="5.594" r="1.44" />
                </svg>
              </a>
            </div>
            <p style="color: #9ca3af; font-size: 12px; margin: 15px 0 0 0;">
              © 2025 DollStore. All rights reserved.<br>
              Jl. Boneka Bahagia No.123, Jakarta
            </p>
          </div>

        </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent to:", email);
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
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
        name: "AmbatuGroup Store",
        address: process.env.GMAIL_USER,
      },
      to: userEmail,
      subject: `Payment Confirmed - Order #${orderData.order_number}`,
      html: `
      <div style="style="margin: 0; padding: 0; background: linear-gradient(135deg, #fce7f3 0%, #e0f2fe 100%); font-family: 'Segoe UI', Arial, sans-serif;"">
              <div
          style="max-width: 600px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(236, 72, 153, 0.15);">

          <!-- Header with gradient -->
          <div style="background: linear-gradient(135deg, #f9a8d4 0%, #67e8f9 100%); padding: 40px 30px; text-align: center;">
            <div
              style="background: white; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <svg style="width: 40px; height: 40px; color: #ec4899;" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold; text-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              DollStore
            </h1>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px;">

            <!-- Success Icon -->
            <div style="text-align: center; margin-bottom: 30px;">
              <div
                style="background: linear-gradient(135deg, #86efac 0%, #6ee7b7 100%); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(134, 239, 172, 0.4);">
                <span style="font-size: 40px;">✓</span>
              </div>
            </div>

            <h2 style="color: #ec4899; text-align: center; font-size: 28px; margin: 0 0 10px 0;">
              Payment Confirmed!
            </h2>
            <p style="text-align: center; color: #6b7280; font-size: 16px; margin: 0 0 30px 0;">
              Your order is being processed 🎉
            </p>

            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Dear Valued Customer,
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Thank you for shopping with us! Your payment has been successfully processed and your adorable plushies are
              being prepared for shipment.
            </p>

            <!-- Order Details Card -->
            <div
              style="background: linear-gradient(135deg, #fce7f3 0%, #e0f2fe 100%); padding: 25px; border-radius: 16px; margin: 30px 0; border-left: 4px solid #ec4899;">
              <h3 style="color: #ec4899; margin: 0 0 20px 0; font-size: 18px; font-weight: bold;">
                📦 Order Details
              </h3>

              <div style="margin-bottom: 15px;">
                <span style="color: #6b7280; font-size: 14px; display: block; margin-bottom: 5px;">Order Number</span>
                <span style="color: #1f2937; font-size: 18px; font-weight: bold;">#${
                  orderData.order_number
                }</span>
              </div>

              <div style="background: white; height: 1px; margin: 15px 0;"></div>

              <div style="margin-bottom: 15px;">
                <span style="color: #6b7280; font-size: 14px; display: block; margin-bottom: 5px;">Total Amount</span>
                <span style="color: #ec4899; font-size: 24px; font-weight: bold;">Rp ${parseFloat(
                  orderData.total_amount || 0
                ).toLocaleString("id-ID")}</span>
              </div>

              <div style="background: white; height: 1px; margin: 15px 0;"></div>

              <div style="margin-bottom: 15px;">
                <span style="color: #6b7280; font-size: 14px; display: block; margin-bottom: 5px;">Payment Method</span>
                <span style="color: #1f2937; font-size: 16px; font-weight: 600;">${
                  orderData.payment_method
                }</span>
              </div>

              <div style="background: white; height: 1px; margin: 15px 0;"></div>

              <div>
                <span style="color: #6b7280; font-size: 14px; display: block; margin-bottom: 5px;">Payment Status</span>
                <span
                  style="background: #86efac; color: #166534; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; display: inline-block;">
                  ${orderData.payment_status}
                </span>
              </div>
            </div>

            <p style="color: #374151; font-size: 16px; line-height: 1.6; text-align: center; margin: 30px 0;">
              We'll notify you once your order is shipped 🚚
            </p>

            <p style="color: #374151; font-size: 16px; line-height: 1.6; text-align: center; margin: 20px 0;">
              Thank you for choosing <strong style="color: #ec4899;">DollStore</strong>! We hope your new plushie brings you
              joy! 💕
            </p>

          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 15px 0;">
              Need help? Contact our support team
            </p>
            <div style="margin: 20px 0;">
              <a href="#" style="display: inline-block; margin: 0 8px; color: #ec4899; text-decoration: none;">
                <svg style="width: 24px; height: 24px;" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M24 4.557a9.93 9.93 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.38 4.482A13.944 13.944 0 011.671 3.149a4.916 4.916 0 001.523 6.556 4.9 4.9 0 01-2.228-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.085 4.918 4.918 0 004.59 3.417 9.867 9.867 0 01-6.102 2.104c-.396 0-.787-.023-1.175-.068A13.933 13.933 0 007.548 21c9.142 0 14.307-7.721 13.995-14.646A9.936 9.936 0 0024 4.557z" />
                </svg>
              </a>
              <a href="#" style="display: inline-block; margin: 0 8px; color: #ec4899; text-decoration: none;">
                <svg style="width: 24px; height: 24px;" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.335 3.608 1.31.975.975 1.247 2.243 1.31 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.335 2.633-1.31 3.608-.975.975-2.243 1.247-3.608 1.31-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.335-3.608-1.31-.975-.975-1.247-2.243-1.31-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.335-2.633 1.31-3.608C4.518 2.568 5.786 2.296 7.152 2.234 8.418 2.175 8.798 2.163 12 2.163zm0-2.163C8.756 0 8.333.014 7.052.072 5.775.13 4.623.437 3.68 1.38 2.737 2.323 2.43 3.475 2.372 4.752.014 8.333 0 8.756 0 12s.014 3.667.072 4.948c.058 1.277.365 2.429 1.308 3.372.943.943 2.095 1.25 3.372 1.308C8.333 23.986 8.756 24 12 24s3.667-.014 4.948-.072c1.277-.058 2.429-.365 3.372-1.308.943-.943 1.25-2.095 1.308-3.372C23.986 15.667 24 15.244 24 12s-.014-3.667-.072-4.948c-.058-1.277-.365-2.429-1.308-3.372-.943-.943-2.095-1.25-3.372-1.308C15.667.014 15.244 0 12 0z" />
                  <path
                    d="M12 5.838A6.162 6.162 0 105.838 12 6.169 6.169 0 0012 5.838zm0 10.162A3.998 3.998 0 118 12a3.998 3.998 0 014 4z" />
                  <circle cx="18.406" cy="5.594" r="1.44" />
                </svg>
              </a>
            </div>
            <p style="color: #9ca3af; font-size: 12px; margin: 15px 0 0 0;">
              © 2025 DollStore. All rights reserved.<br>
              Jl. Boneka Bahagia No.123, Jakarta
            </p>
          </div>

        </div>
      </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(
      `✅ Payment confirmation email sent for Order #${orderData.order_number}`
    );
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("❌ Error sending payment confirmation email:", error);
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
