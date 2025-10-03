import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/sections/HeroSection";
import TimelineSection from "../components/sections/TimelineSection";
import ProductInfoSection from "../components/sections/ProductInfoSection";
import ProductGrid from "../components/sections/ProductGrid";
import NewsletterSection from "../components/sections/NewsletterSection";

import { useCart } from "../context/cartContext";

import {getProducts} from "../services/exampleService"

const mockProducts = [
  { product_id: 1, name: "Classic Burger", price: "Rp 45.000" },
  { product_id: 2, name: "Chicken Deluxe", price: "Rp 55.000" },
  { product_id: 3, name: "Veggie Burger", price: "Rp 40.000" },
];

function Home() {
  const [products, setProducts] = useState([]);
  const { addItem } = useCart();

  function handleTryBuyProduct(){
    addItem(4, 1)
  }

  useEffect(() => setProducts(mockProducts), []);

  const handleDelete = (id) =>
    setProducts(products.filter((p) => p.product_id !== id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-cyan-50">
      <Navbar />
      <HeroSection />
      <TimelineSection />
      <ProductInfoSection />

      <button onClick={handleTryBuyProduct} className="m-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"> COBAIN ANJING </button>

      {/* Section Produk */}
      <section className="py-24 px-6 bg-gradient-to-br from-pink-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <ProductGrid products={products} onDelete={handleDelete} />
        </div>
      </section>

      <NewsletterSection />
      <Footer />
    </div>
  );
}

export default Home;
