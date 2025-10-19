const express = require("express");
const cors = require("cors");
const path = require("path");

process.on("uncaughtException", (err) =>
  console.error("Uncaught Exception:", err)
);
process.on("unhandledRejection", (err) =>
  console.error("Unhandled Rejection:", err)
);

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
  origin:
    process.env.NODE_ENV === "production"
      ? "*" // e.g. https://yourfrontend.com
      : "*",
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

// // 💥 Error handler
// app.use((err, req, res, next) => {
//   console.error("❌ Error:", err.stack);
//   res.status(500).json({ error: "Something went wrong!" });
// });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


// Add this to test Prisma connection
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Test database connection on startup
prisma.$connect()
  .then(() => console.log('✅ Database connected'))
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });
