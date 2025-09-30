import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Button from "../components/ui/Button";
import HeroSection from "../components/sections/HeroSection";
import TimelineSection from "../components/sections/TimelineSection";
import ProductInfoSection from "../components/sections/ProductInfoSection";
import NewsletterSection from "../components/sections/NewsletterSection";
import ProductGrid from "../components/sections/ProductsGrid";

const mockProducts = [
  { product_id: 1, name: "Classic Burger", price: "$12.99", image: "/api/placeholder/300/200" },
  { product_id: 2, name: "Chicken Deluxe", price: "$14.99", image: "/api/placeholder/300/200" },
  { product_id: 3, name: "Veggie Burger", price: "$11.99", image: "/api/placeholder/300/200" },
];

function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => setProducts(mockProducts), []);

  const handleDelete = (id) => setProducts(products.filter(p => p.product_id !== id));

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <HeroSection />
      <TimelineSection />
      <ProductInfoSection />
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <ProductGrid products={products} onDelete={handleDelete} />
        </div>
      </section>
      <NewsletterSection />
      <Footer />
    </div>
  );
}

export default HomePage;
