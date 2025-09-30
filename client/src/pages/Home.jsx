import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/sections/HeroSection";
import TimelineSection from "../components/sections/TimelineSection";
import ProductInfoSection from "../components/sections/ProductInfoSection";
import ProductGrid from "../components/sections/ProductGrid";
import NewsletterSection from "../components/sections/NewsletterSection";

const mockProducts = [
  { product_id: 1, name: "Classic Burger", price: "Rp 45.000" },
  { product_id: 2, name: "Chicken Deluxe", price: "Rp 55.000" },
  { product_id: 3, name: "Veggie Burger", price: "Rp 40.000" },
];

function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => setProducts(mockProducts), []);

  const handleDelete = (id) => setProducts(products.filter(p => p.product_id !== id));

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <HeroSection />
      <TimelineSection />
      <ProductInfoSection />
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <ProductGrid products={products} onDelete={handleDelete} />
        </div>
      </section>
      <NewsletterSection />
      <Footer />
    </div>
  );
}

export default HomePage;
