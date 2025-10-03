import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/sections/HeroSection";
import TimelineSection from "../components/sections/TimelineSection";
import ProductInfoSection from "../components/sections/ProductInfoSection";
import ProductGrid from "../components/sections/ProductGrid";
import NewsletterSection from "../components/sections/NewsletterSection";

// Data boneka contoh
const mockProducts = [
  { product_id: 1, name: "Teddy Bear Classic", price: "Rp 150.000" },
  { product_id: 2, name: "Bunny Plush White", price: "Rp 120.000" },
  { product_id: 3, name: "Unicorn Pink Doll", price: "Rp 175.000" },
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
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection
        title="Koleksi Boneka Imut & Lembut"
        subtitle="Temukan berbagai boneka lucu untuk hadiah, koleksi, atau teman peluk kesayanganmu."
        buttonText="Belanja Sekarang"
      />

      {/* Timeline (misalnya tentang brand/story toko boneka) */}
      <TimelineSection title="Perjalanan Toko Boneka Kami" />

      {/* Info tentang produk boneka */}
      <ProductInfoSection title="Mengapa Boneka Kami Spesial?" />

      <button onClick={handleTryBuyProduct} className="m-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"> COBAIN ANJING </button>

      {/* Section Produk */}
      <section className="py-24 px-6 bg-gradient-to-br from-pink-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-pink-600 mb-12">
            Koleksi Boneka Favorit
          </h2>
          <ProductGrid products={products} onDelete={handleDelete} />
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection
        title="Dapatkan Update Koleksi Boneka Baru"
        subtitle="Masukkan email kamu dan jangan sampai ketinggalan promo serta koleksi boneka terbaru."
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
