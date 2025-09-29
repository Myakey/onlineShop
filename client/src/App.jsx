import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

// Admin pages
import AdminDashboard from "./pages/admin";
import AddProduct from "./pages/AddProduct";
import AdminReviews from "./pages/AdminReviews";

// Product pages
import ProductList from "./pages/products/ProductList";
import ProductDetails from "./pages/products/ProductDetails";

// Review & Order pages
import Reviews from "./pages/AdminReviews";   // pastikan ada file Reviews.jsx
import Order from "./pages/Order";             // pastikan ada file Order.jsx

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />

        {/* Product Routes */}
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        {/* Review & Order Routes */}
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/order" element={<Order />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
