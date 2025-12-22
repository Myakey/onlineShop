// middleware/limiter.js
const rateLimit = require("express-rate-limit");

// -----------------------------
// AUTH LIMITERS
// -----------------------------
exports.registerLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 hour
    max: 100,
    message: "Too many registration attempts. Please try again later."
});

exports.loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: "Too many login attempts. Please wait a moment."
});

exports.otpLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 3,
    message: "Too many OTP requests. Please try again in 1 minute."
});

// -----------------------------
// SHIPMENT / SHIPPING LIMITERS
// -----------------------------
exports.shippingRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: "Too many shipping cost requests. Please slow down."
});

exports.shipmentTrackingLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: "Too many tracking requests. Please try again later."
});

// -----------------------------
// ORDER LIMITERS
// -----------------------------
exports.orderCreateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, //initially 3
    message: "You can only create a few orders per hour."
});

exports.orderCancelLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,
    message: "Too many cancel attempts. Try again later."
});

// -----------------------------
// PAYMENT LIMITERS
// -----------------------------
exports.uploadPaymentProofLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: "Too many payment proof uploads. Try again later."
});

exports.adminRefundLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: "Too many refund requests. Slow down."
});

// -----------------------------
// CART LIMITER
// -----------------------------
exports.cartLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: "Too many cart updates. Slow down."
});

// -----------------------------
// REVIEW LIMITER
// -----------------------------
exports.reviewLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: "Too many review actions. Try again later."
});

// -----------------------------
// PRODUCT SEARCH LIMITER
// -----------------------------
exports.searchLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: "Too many search requests. Please wait a moment."
});
