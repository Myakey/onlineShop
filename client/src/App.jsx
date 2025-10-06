import "./App.css";
import HomePage from "./pages/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoutes";
import About from "./pages/About";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

// import AdminPage from "./pages/admin";
import CartPage from "./pages/Cart";
import Register from "./pages/Register";

// Admin pages
import AdminPage from "./pages/AdminPage";
import AddProduct from "./pages/AddProduct";
import AdminProduct from "./pages/AdminProduct";
import AdminOrder from "./pages/AdminOrder";
import AdminOrderDetail from "./pages/AdminOrderDetail";
import AdminProductDetail from "./pages/AdminProductDetail";
import AdminProductEdit from "./pages/AdminProductEdit";

import Payment from "./pages/Payment";

// Product pages
import Product from "./pages/Product";
import ProductDetails from "./pages/ProductDetails";

// Review & Order pages
import Reviews from "./pages/AdminReviews";
import Order from "./pages/Order";

import { UserProvider } from "./context/userContext";
import { CartProvider } from "./context/cartContext";

//Some debugs temporary files:
import DebugPage from "./pages/DebugPage";
import AdminDebugPage from "./pages/AdminDebugPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50">
        <UserProvider>
          <CartProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<HomePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/debug-page" element={<DebugPage />} />

              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/order" element={<Order />}/>
              <Route path="/payment" element={<Payment />} />

              <Route path="/debug-page" element={<DebugPage />}/>
              <Route
                path="/admin-dashboard"
                element={
                  <AdminRoute>
                    <AdminDebugPage />
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
              <Route path="/order" element={<Order />} />

              {/* Admin Routes */}
              <Route
                path="/adminDashboard"
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <AdminProduct />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <AdminOrder />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/add-product"
                element={
                  <AdminRoute>
                    <AddProduct />
                  </AdminRoute>
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
