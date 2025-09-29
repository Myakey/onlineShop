import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
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
import AddProduct from "./pages/AddProduct";
//Jangan lupa diganti bang supaya sama dengan yang kiel
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AdminPage from "./pages/AdminPage";

import axios from "axios";

function App() {
  const [count, setCount] = useState(0);
  const [array, setArray] = useState([]);

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
