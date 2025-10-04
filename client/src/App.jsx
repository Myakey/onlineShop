import "./App.css";
import HomePage from "./pages/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoutes";
import About from "./pages/About";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import DebugPage from "./pages/DebugPage";
// import AdminPage from "./pages/admin";
import CartPage from "./pages/Cart";

// Pages
import Register from "./pages/Register";

// import halaman cart
import Cart from "./pages/Cart";

// Admin pages

import AddProduct from "./pages/AddProduct";
import AdminReviews from "./pages/AdminReviews";
import AdminProduct from "./pages/AdminProduct";
import AdminProductDetail from "./pages/AdminProductDetail";
import AdminProductEdit from "./pages/AdminProductEdit";
import AdminOrder from "./pages/AdminOrder";
import AdminOrderDetail from "./pages/AdminOrderDetail";

// Product pages
import Product from "./pages/Product";
import ProductDetails from "./pages/ProductDetails";

// Review & Order pages
import Reviews from "./pages/AdminReviews"; // pastikan ada file Reviews.jsx
import Order from "./pages/Order"; // pastikan ada file Order.jsx
import { UserProvider } from "./context/userContext";
import { CartProvider } from "./context/cartContext";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50">
        <UserProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<HomePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/order" element={<Order />}/>

              <Route path="/debug-page" element={<DebugPage />}/>
              <Route
                path="/adminDashboard"
                element={
                  <AdminRoute>
                   
                  </AdminRoute>
                }
              />

              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </CartProvider>
        </UserProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
