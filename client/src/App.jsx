import "./App.css";
import HomePage from "./pages/public/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoutes";
import About from "./pages/public/About";
import Login from "./pages/Login";
import Profile from "./pages/user/Profile";

// import AdminPage from "./pages/admin";
import CartPage from "./pages/user/Cart";
import Register from "./pages/Register";

// Admin pages
import AdminPage from "./pages/AdminPage";
import AddProduct from "./pages/admin/AddProduct";
import AdminProduct from "./pages/AdminProduct";
import AdminOrder from "./pages/AdminOrder";
import AdminOrderDetail from "./pages/AdminOrderDetail";
import AdminProductDetail from "./pages/AdminProductDetail";
import AdminProductEdit from "./pages/AdminProductEdit";

// Product pages
import Product from "./pages/public/Product";
import ProductDetails from "./pages/public/ProductDetails";

// Review & Order pages
import Reviews from "./pages/AdminReviews";
import Order from "./pages/user/Order";
import MyOrders from "./pages/user/OrderList";

import { UserProvider } from "./context/userContext";
import { CartProvider } from "./context/cartContext";
import Payment from "./pages/user/Payment";

import WriteReview from "./pages/user/WriteReview";

//Some debugs temporary files:
import DebugPage from "./pages/DebugPage";

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
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/products" element={<Product />} />

              <Route element={<ProtectedRoute />}>
                {/* Protected Routes */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/order" element={<Order />} />
                <Route path="/order-list" element={<MyOrders />} />
                <Route path="/payment/:token" element={<Payment />} />
                <Route path="/orders/:token/review" element={<WriteReview />}/>
              </Route>

              {/* Admin Routes */}
              <Route
                path="/admin-dashboard"
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
