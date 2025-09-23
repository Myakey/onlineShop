import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HomePage from './pages/Home'
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';
import About from './pages/About'
import AddProduct from './pages/AddProduct'

import axios from "axios";

function App() {
  const [count, setCount] = useState(0);
  const [array, setArray] = useState([]);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/add-product" element={<AddProduct />}></Route>
        {/* <Route path="/products" element={}>
          <Route path="car" element={} />
          <Route path="bike" element={} />
        </Route>
        <Route path="/contact" element={} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
