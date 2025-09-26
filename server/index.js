const express = require("express");
const app = express();
const productsRoutes = require('./routes/productsRoutes');
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const path = require("path");
const { requireAdmin } = require("./middleware/authMiddleware");

// const corsOptions = {
//   origin: process.env.NODE_ENV === 'production' 
//     ? ['https://yourdomain.com'] // Replace with your actual domain
//     : ['http://localhost:3000', 'http://localhost:3001'], // React dev servers
//   credentials: true
// };

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(express.json());

// Actually use your routes instead of empty handler
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
app.use("/api/products", productsRoutes);
app.use("/auth", authRoutes);

app.use("/api/admin/products", requireAdmin, productsRoutes);

//Error handling

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({ error: 'Route not found' });
// });

app.listen(8080, () => {
  console.log("Server has started on port 8080");
});
// app.get("/api", (req, res) => {
//   res.json({ fruits: ["apple", "orange", "banana"] });
// });
