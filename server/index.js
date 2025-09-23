const express = require("express");
const app = express();
const productsRoutes = require('./routes/productsRoutes');
const cors = require("cors");
const path = require("path");

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.use(express.json());

// Actually use your routes instead of empty handler
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
app.use("/api/products", productsRoutes);

app.listen(8080, () => {
  console.log("Server has started on port 8080");
});
// app.get("/api", (req, res) => {
//   res.json({ fruits: ["apple", "orange", "banana"] });
// });
