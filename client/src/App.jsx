import "./App.css";
import HomePage from "./pages/Home";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet,
  Navigate,
} from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoutes";
import About from "./pages/About";
//Jangan lupa diganti bang supaya sama dengan yang kiel
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AdminPage from "./pages/AdminPage";

// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";

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
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/add-product" element={<AddProduct />}></Route>
        <Route path="/login" element={<Login />}></Route>
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


        {/* <Route path="/products" element={}>
          <Route path="car" element={} />
          <Route path="bike" element={} />
        </Route>
        <Route path="/contact" element={} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
