import "./App.css";
import HomePage from "./pages/Home";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoutes";
import About from "./pages/About";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AdminPage from "./pages/AdminPage";

// Pages
import Register from "./pages/Register";

// Admin pages
import AdminDashboard from "./pages/admin";
import AddProduct from "./pages/AddProduct";
import AdminReviews from "./pages/AdminReviews";

// Product pages
import Product from "./pages/Product";

// Review & Order pages
import Reviews from "./pages/AdminReviews";   // pastikan ada file Reviews.jsx
import Order from "./pages/Order";            // pastikan ada file Order.jsx

function App() {
  return (
    <BrowserRouter>
      {/* Tambahin wrapper background */}
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50">
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
          <Route
            path="/adminDashboard"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
