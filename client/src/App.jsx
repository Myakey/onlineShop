import "./App.css";
import HomePage from "./pages/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import About from "./pages/About";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

// import halaman cart
import Cart from "./pages/Cart";

// Admin pages
import AdminPage from "./pages/AdminPage";
import AddProduct from "./pages/AddProduct";
import AdminReviews from "./pages/AdminReviews";

// Product pages
import Product from "./pages/Product";
import ProductDetails from "./pages/ProductDetails";

// Review & Order pages
import Order from "./pages/Order"; // pastikan Order.jsx ada

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50">
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Public pages */}
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reviews" element={<AdminReviews />} />
          <Route path="/cart" element={<Cart />} />

          {/* Sebelumnya protected, sekarang bebas */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/order" element={<Order />} />

          {/* Sebelumnya admin, sekarang bebas */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />

          {/* Catch all: jika route tidak ditemukan */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
