import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HomePage from './pages/Home'
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';

import axios from "axios";

function App() {
  const [count, setCount] = useState(0);
  const [array, setArray] = useState([]);

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api");
    setArray(response.data.fruits);
    console.log(response.data.fruits);
  };

  useEffect(() => {
    fetchAPI();
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
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
