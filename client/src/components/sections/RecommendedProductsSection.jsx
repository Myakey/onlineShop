import React, { useState, useEffect } from "react";
import { Star, X, Loader2, AlertCircle, ShoppingCart } from "lucide-react";
import productService from "../../services/productService";
import { useCart } from "../../context/cartContext";
import { useNavigate } from "react-router-dom";

const RecommendedProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendedProducts();
  }, []);

  const fetchRecommendedProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await productService.getProducts();
      const productsData = Array.isArray(response)
        ? response
        : response.data || response.products || [];

      // Filter hanya produk yang direkomendasi
      const recommended = productsData.filter((p) => p.is_recommended);
      setProducts(recommended);
    } catch (err) {
      console.error("Error fetching recommended products:", err);
      setError("Gagal memuat produk rekomendasi.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = (product) => {
    addItem(product.product_id, 1);
    handleCloseModal();
  };

  // Jangan render section jika tidak ada produk rekomendasi
  if (loading) {
    return (
      <div className="w-full py-24 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-pink-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-semibold">
            Memuat produk rekomendasi...
          </p>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return null; // Jangan tampilkan apa-apa jika error atau tidak ada produk
  }

  return (
    <div className="w-full py-24 px-6 bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-purple-100 px-6 py-2 rounded-full mb-4 shadow-sm">
            <Star className="w-5 h-5 text-pink-500 fill-pink-500" />
            <span className="text-pink-600 font-semibold">
              Pilihan Terbaik Kami
            </span>
          </div>
          <h2 className="text-5xl font-black text-gray-900 mb-4">
            Produk Rekomendasi untuk Anda
          </h2>
          <p className="text-gray-600 text-lg">
            Koleksi boneka pilihan yang kami rekomendasikan khusus untuk Anda ✨
          </p>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
          {products.map((product) => (
            <div
              key={product.product_id}
              className="group relative bg-white border border-pink-100 rounded-3xl overflow-hidden hover:border-pink-400 transition-all duration-500 transform hover:-translate-y-3 shadow-sm hover:shadow-2xl w-full"
            >
              {/* Product Image */}
              <div className="h-80 bg-gradient-to-br from-pink-100/40 to-purple-200/40 overflow-hidden relative w-full">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="w-full h-full flex items-center justify-center text-8xl"
                  style={{ display: product.image_url ? "none" : "flex" }}
                >
                  🧸
                </div>
                {/* Recommendation Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                  <Star size={14} className="fill-yellow-900" />
                  Rekomendasi
                </div>
              </div>

              {/* Content */}
              <div className="p-8 w-full">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-base mb-6 line-clamp-2">
                  {product.description || "Boneka imut dan berkualitas tinggi"}
                </p>
                <div className="flex items-center justify-between w-full mb-4">
                  <span className="text-4xl font-black text-transparent bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text">
                    Rp {Number(product.price).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-semibold text-base shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Lihat Detail
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="px-4 py-3 bg-white border-2 border-pink-500 text-pink-500 rounded-xl font-semibold shadow-md hover:bg-pink-50 transform hover:scale-105 transition-all duration-300"
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/products")}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Lihat Semua Produk
          </button>
        </div>
      </div>

      {/* Modal Pop-up */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              {/* Product Image */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-pink-100/40 to-purple-200/40 h-96 md:h-full">
                {selectedProduct.image_url ? (
                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="w-full h-full flex items-center justify-center text-8xl"
                  style={{
                    display: selectedProduct.image_url ? "none" : "flex",
                  }}
                >
                  🧸
                </div>
                <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                  <Star size={14} className="fill-yellow-900" />
                  Rekomendasi
                </div>
              </div>

              {/* Product Details */}
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-4xl font-black text-gray-900 mb-4">
                    {selectedProduct.name}
                  </h2>
                  <div className="text-5xl font-black text-transparent bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text mb-6">
                    Rp {Number(selectedProduct.price).toLocaleString("id-ID")}
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Deskripsi Produk
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedProduct.description ||
                        "Boneka imut dan berkualitas tinggi yang sempurna untuk hadiah atau koleksi pribadi Anda."}
                    </p>
                  </div>
                  {selectedProduct.stock !== undefined && (
                    <div className="mb-6">
                      <span
                        className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                          selectedProduct.stock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedProduct.stock > 0
                          ? `Stok: ${selectedProduct.stock} tersedia`
                          : "Stok Habis"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleAddToCart(selectedProduct)}
                    disabled={selectedProduct.stock === 0}
                    className="w-full px-8 py-4 bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={20} />
                    {selectedProduct.stock === 0
                      ? "Stok Habis"
                      : "Tambah ke Keranjang"}
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="w-full px-8 py-4 bg-gray-200 rounded-xl text-gray-700 font-bold text-lg hover:bg-gray-300 transition-all duration-300"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RecommendedProductsSection;