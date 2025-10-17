// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// 🧩 Import routes
const productsRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const shippingRoutes = require("./routes/shippingRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const { requireAdmin } = require("./middleware/authMiddleware");

// 🌍 CORS setup
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.CLIENT_URL // e.g. https://yourfrontend.com
      : ["http://localhost:5173", "http://localhost:3000"], // dev servers
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🧭 Routes
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
app.use("/api/products", productsRoutes);
app.use("/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin/products", requireAdmin, productsRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/orders", orderRoutes);


// 🩺 Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// // 🧱 404 Handler
// app.use("*", (req, res) => {
//   res.status(404).json({ error: "Route not found" });
// });

// 💥 Error handler (always last)
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 🚀 Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
