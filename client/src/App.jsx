import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Context
import { UserProvider } from "./context/userContext";
import { CartProvider } from "./context/cartContext";

// Route Guards
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoutes";

// Public Pages
import HomePage from "./pages/public/Home";
import About from "./pages/public/About";
import Product from "./pages/public/Product";
import ProductDetails from "./pages/public/ProductDetails";

// Auth Pages
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import NewPassword from "./pages/NewPassword";

// User Pages
import Profile from "./pages/user/Profile";
import Wishlist from "./pages/user/Wishlist";
import CartPage from "./pages/user/Cart";
import Order from "./pages/user/Order";
import MyOrders from "./pages/user/OrderList";
import OrderDetailsPage from "./pages/user/OrderDetails";
import Payment from "./pages/user/Payment";
import WriteReview from "./pages/user/WriteReview";

// Admin Pages
import AdminPage from "./pages/AdminPage";
import AdminProduct from "./pages/AdminProduct";
import AdminProductDetail from "./pages/AdminProductDetail";
import AdminProductEdit from "./pages/AdminProductEdit";
import AddProduct from "./pages/admin/AddProduct";
import AdminOrder from "./pages/AdminOrder";
import AdminShippingMethods from "./pages/admin/AdminShippingMethods";
import StoreSettings from "./pages/admin/StoreSettings";
import Reviews from "./pages/AdminReviews";

// Debug
import DebugPage from "./pages/DebugPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50">
        <UserProvider>
          <CartProvider>
            <Routes>
              {/* Redirect */}
              <Route path="/dashboard" element={<Navigate to="/" replace />} />

              {/* ===== PUBLIC ROUTES ===== */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Product />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<NewPassword />} />
              <Route path="/debug-page" element={<DebugPage />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/products" element={<Product />} />
              <Route path="/reviews" element={<Reviews />} />
              

              {/* ===== PROTECTED USER ROUTES ===== */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/order" element={<Order />} />
                <Route path="/order-list" element={<MyOrders />} />
                <Route
                  path="/orders/:secureToken"
                  element={<OrderDetailsPage />}
                />
                <Route path="/payment/:token" element={<Payment />} />
                <Route
                  path="/orders/:token/review"
                  element={<WriteReview />}
                />
              </Route>

              {/* ===== ADMIN ROUTES ===== */}
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
                path="/admin/products/:productId"
                element={
                  <AdminRoute>
                    <AdminProductDetail />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/products/edit/:productId"
                element={
                  <AdminRoute>
                    <AdminProductEdit />
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

              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <AdminOrder />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/shipping-methods"
                element={
                  <AdminRoute>
                    <AdminShippingMethods />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/store-settings"
                element={
                  <AdminRoute>
                    <StoreSettings />
                  </AdminRoute>
                }
              />

              <Route
                path="/reviews"
                element={
                  <AdminRoute>
                    <Reviews />
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
