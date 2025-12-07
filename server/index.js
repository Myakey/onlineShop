const express = require("express");
const cors = require("cors");
const prisma = require('./config/prisma'); 
//hosting di railway env variablenya
console.log('🚂 Railway Environment:', {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT
});
//handling error saat hosting
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

//import berbagai routes
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const productsRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const shipmentRoutes = require("./routes/shipmentRoutes");
const shippingMethodRoutes = require("./routes/shippingMethodRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");


const { requireAdmin } = require("./middleware/authMiddleware");
//core function dari express js
const app = express();

//cors agar bisa connect dengan frontend
const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//routes layer 1, yang menerima route dari front end kemudian akan dikirim ke route yang sesuai
app.use("/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/admin/products", requireAdmin, productsRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/shipping", shipmentRoutes);
app.use("/api/shippingMethods", shippingMethodRoutes);
app.use("/api/wishlist", wishlistRoutes);

//cek health untuk memastikan berjalan dengan lancar
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

//shutdown
async function startServer() {
  try {
    //jalankan server
    server = app.listen(PORT, HOST, () => {
      console.log(`Server running on ${HOST}:${PORT}`);
    });

    //koneksi ke database
    prisma.$connect()
      .then(() => console.log('Database connected'))
      .catch(err => console.error('Database connection failed (will retry):', err.message));

    //shutdown server
    const shutdown = async (signal) => {
      if (isShuttingDown) return;
      isShuttingDown = true;
      
      console.log(` ${signal} received, shutting down...`);
      
      //close server untuk menutup request baru
      server.close(async () => {
        console.log('HTTP server closed');
        try {
          await prisma.$disconnect();
          console.log('Database disconnected');
        } catch (err) {
          console.error('Error disconnecting DB:', err);
        }
        process.exit(0);
      });

      //paksa shutdown setelah 5 detik
      setTimeout(() => {
        console.error(' Forced shutdown');
        process.exit(1);
      }, 5000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

module.exports = { prisma };