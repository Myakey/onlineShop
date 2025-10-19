const express = require("express");
const cors = require("cors");
const path = require("path");
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Log environment info
console.log('🚂 Railway Environment:', {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DB_HOST: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'not set'
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🧭 Routes
app.use("/api/products", productsRoutes);
app.use("/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin/products", requireAdmin, productsRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

// 🩺 Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// Connect to database BEFORE starting server
async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
    
    const server = app.listen(PORT, HOST, () => {
      console.log(`✅ Server running on ${HOST}:${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('📡 SIGTERM received, shutting down gracefully...');
      await prisma.$disconnect();
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

// Export prisma for use in routes
module.exports = { prisma };