import React, { useState, useEffect } from "react";
import { useCart } from "../../context/cartContext";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import HeroSection from "../../components/sections/HeroSection";
import ProductInfoSection from "../../components/sections/ProductInfoSection";
import ProductGrid from "../../components/sections/ProductGrid";
import RecommendedProductsSection from "../../components/sections/RecommendedProductsSection";
import NewsletterSection from "../../components/sections/NewsletterSection";
import productService from "../../services/productService";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addItem } = useCart();

  // State animasi
  const [recommendedVisible, setRecommendedVisible] = useState(false);
  const [productGridVisible, setProductGridVisible] = useState(false);

  function handleTryBuyProduct() {
    addItem(4, 1);
  }

  // Fetch produk
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts();
        const productsData = Array.isArray(response)
          ? response
          : response.data || response.products || [];

        // Hanya produk NON recommended untuk ProductGrid
        const nonRecommended = productsData.filter(
          (p) => !p.is_recommended
        );

        setProducts(nonRecommended);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Observer RecommendedProductsSection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRecommendedVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    const section = document.querySelector("[data-recommended-section]");
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  // Observer ProductGrid
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

      {/* Hero */}
      <HeroSection
        title="Koleksi Boneka Imut & Lembut"
        subtitle="Temukan berbagai boneka lucu untuk hadiah, koleksi, atau teman peluk kesayanganmu."
        buttonText="Belanja Sekarang"
      />

      {/* Info */}
      <ProductInfoSection title="Mengapa Boneka Kami Spesial?" />

      {/* Recommended Products */}
      <section
        data-recommended-section
        className={`w-full transition-all duration-1000 ease-out transform ${
          recommendedVisible
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95"
        }`}
      >
        <RecommendedProductsSection />
      </section>

      {/* Semua Produk (non-recommended) */}
      {products.length > 0 && (
        <section
          data-product-grid
          className={`w-full py-24 px-6 bg-gradient-to-br from-pink-150 via-white to-pink-50 transition-all duration-1000 ease-out transform ${
            productGridVisible
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95"
          }`}
        >
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-gray-900 mb-4">
                Semua Produk Kami
              </h2>
              <p className="text-gray-600 text-lg">
                Jelajahi koleksi lengkap boneka berkualitas tinggi kami
              </p>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <p className="text-gray-500">Memuat produk...</p>
              </div>
            ) : (
              <ProductGrid products={products} onDelete={handleDelete} />
            )}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <NewsletterSection
        title="Dapatkan Update Koleksi Boneka Baru"
        subtitle="Masukkan email kamu dan jangan sampai ketinggalan promo serta koleksi boneka terbaru."
      />

      <Footer />
    </div>
  );
}

export default Home;
