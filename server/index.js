const express = require("express");
const cors = require("cors");
const prisma = require('./config/prisma'); // Use singleton

console.log('🚂 Railway Environment:', {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT
});

// Don't exit on errors in production
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// 🧩 Import routes
const productsRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const shippingRoutes = require("./routes/shippingRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const { requireAdmin } = require("./middleware/authMiddleware");

const app = express();

// 🌍 CORS setup
const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// 🧭 Routes
app.use("/api/products", productsRoutes);
app.use("/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin/products", requireAdmin, productsRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

// 🩺 Health check - MUST respond quickly
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "API Running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

let server;
let isShuttingDown = false;

// Start server immediately - don't wait for DB
async function startServer() {
  try {
    // Start server FIRST
    server = app.listen(PORT, HOST, () => {
      console.log(`✅ Server running on ${HOST}:${PORT}`);
    });

    // Connect to DB in background (don't block server startup)
    prisma.$connect()
      .then(() => console.log('✅ Database connected'))
      .catch(err => console.error('⚠️ Database connection failed (will retry):', err.message));

    // Graceful shutdown
    const shutdown = async (signal) => {
      if (isShuttingDown) return;
      isShuttingDown = true;
      
      console.log(`📡 ${signal} received, shutting down...`);
      
      // Stop accepting new requests
      server.close(async () => {
        console.log('✅ HTTP server closed');
        try {
          await prisma.$disconnect();
          console.log('✅ Database disconnected');
        } catch (err) {
          console.error('Error disconnecting DB:', err);
        }
        process.exit(0);
      });

      // Force shutdown after 5 seconds
      setTimeout(() => {
        console.error('⚠️ Forced shutdown');
        process.exit(1);
      }, 5000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

module.exports = { prisma };