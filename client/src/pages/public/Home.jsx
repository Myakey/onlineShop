import React, { useState, useEffect } from "react";
import { useCart } from "../../context/cartContext";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import HeroSection from "../../components/sections/HeroSection";
import TimelineSection from "../../components/sections/TimelineSection";
import ProductInfoSection from "../../components/sections/ProductInfoSection";
import ProductGrid from "../../components/sections/ProductGrid";
import NewsletterSection from "../../components/sections/NewsletterSection";
import productService from "../../services/productService";


function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // TAMBAHKAN INI
  const { addItem } = useCart();

  function handleTryBuyProduct(){
    addItem(4, 1)
  }

  // GANTI useEffect dengan ini:
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts();
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = (id) =>
    setProducts(products.filter((p) => p.product_id !== id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-cyan-50">
      <Navbar />
      <HeroSection
        title="Koleksi Boneka Imut & Lembut"
        subtitle="Temukan berbagai boneka lucu untuk hadiah, koleksi, atau teman peluk kesayanganmu."
        buttonText="Belanja Sekarang"
      />
      <TimelineSection title="Perjalanan Toko Boneka Kami" />
      <ProductInfoSection title="Mengapa Boneka Kami Spesial?" />


      {/* Section Produk */}
      <section className="py-24 px-6 bg-gradient-to-br from-pink-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-pink-600 mb-12">
            Koleksi Boneka Favorit
          </h2>
          {loading ? (
            <div className="text-center py-16">
              <p className="text-gray-500">Memuat produk...</p>
            </div>
          ) : (
            <ProductGrid products={products} onDelete={handleDelete} />
          )}
        </div>
      </section>

      <NewsletterSection
        title="Dapatkan Update Koleksi Boneka Baru"
        subtitle="Masukkan email kamu dan jangan sampai ketinggalan promo serta koleksi boneka terbaru."
      />
      <Footer />
    </div>
  );
}

export default Home;
