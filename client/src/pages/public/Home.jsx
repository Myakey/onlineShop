import React, { useState, useEffect } from "react";
import { useCart } from "../../context/cartContext";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import HeroSection from "../../components/sections/HeroSection";
import ProductInfoSection from "../../components/sections/ProductInfoSection";
import ProductGrid from "../../components/sections/ProductGrid";
import NewsletterSection from "../../components/sections/NewsletterSection";
import productService from "../../services/productService";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  // Hanya untuk productGrid
  const [productGridVisible, setProductGridVisible] = useState(false);

  function handleTryBuyProduct() {
    addItem(4, 1);
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts();
        setProducts(response.data || response);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // IntersectionObserver hanya untuk productGrid
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setProductGridVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    const section = document.querySelector("[data-product-grid]");
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  const handleDelete = (id) =>
    setProducts(products.filter((p) => p.product_id !== id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      <Navbar />

      {/* HeroSection tanpa animasi */}
      <HeroSection
        title="Koleksi Boneka Imut & Lembut"
        subtitle="Temukan berbagai boneka lucu untuk hadiah, koleksi, atau teman peluk kesayanganmu."
        buttonText="Belanja Sekarang"
      />

      {/* ProductInfoSection tanpa animasi */}
      <ProductInfoSection title="Mengapa Boneka Kami Spesial?" />

      {/* ProductGrid dengan animasi */}
      <section
        data-product-grid
        className={`w-full py-24 px-6 bg-gradient-to-br from-pink-150 via-white to-pink-50 relative transition-all duration-1000 ease-out transform ${
          productGridVisible
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95"
        }`}
      >
        <div className="max-w-7xl mx-auto w-full">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-gray-500">Memuat produk...</p>
            </div>
          ) : (
            <ProductGrid products={products} onDelete={handleDelete} />
          )}
        </div>
      </section>

      {/* Newsletter tanpa animasi */}
      <NewsletterSection
        title="Dapatkan Update Koleksi Boneka Baru"
        subtitle="Masukkan email kamu dan jangan sampai ketinggalan promo serta koleksi boneka terbaru."
      />

      <Footer />
    </div>
  );
}

export default Home;
