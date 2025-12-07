import React, { useState, useEffect } from "react";
import { Heart, Trash2, ShoppingCart, Package, AlertCircle } from "lucide-react";
import wishlistService from "../../services/wishList";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await wishlistService.getWishlist();
      
      if (response.success) {
        setWishlist(response.data);
      } else {
        setError(response.message || "Failed to fetch wishlist");
      }
    } catch (err) {
      console.error("Fetch wishlist error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await wishlistService.removeFromWishlist(productId);

      if (response.success) {
        setWishlist(wishlist.filter((item) => item.product_id !== productId));
      } else {
        alert(response.message || "Failed to remove item");
      }
    } catch (err) {
      console.error("Remove from wishlist error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const clearWishlist = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus semua wishlist?")) {
      return;
    }

    try {
      const response = await wishlistService.clearWishlist();

      if (response.success) {
        setWishlist([]);
        alert("Wishlist berhasil dikosongkan!");
      } else {
        alert(response.message || "Failed to clear wishlist");
      }
    } catch (err) {
      console.error("Clear wishlist error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const addToCart = async (productId) => {
    try {
      const response = await fetch("http://localhost:8080/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Produk berhasil ditambahkan ke keranjang!");
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-pink-50 to-sky-50">
      <Navbar />

      <div className="px-8 py-12 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-sm border border-pink-200 p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-pink-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <Heart className="text-white" size={32} fill="currentColor" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800">Wishlist Saya</h1>
                  <p className="text-gray-500 mt-2">
                    {wishlist.length} {wishlist.length === 1 ? 'produk' : 'produk'} tersimpan
                  </p>
                </div>
              </div>
              {wishlist.length > 0 && (
                <button
                  onClick={clearWishlist}
                  className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-300 flex items-center gap-2 font-semibold border border-red-200"
                >
                  <Trash2 size={20} />
                  <span>Hapus Semua</span>
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-8 flex items-center gap-3">
              <AlertCircle size={24} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-400 mx-auto mb-4"></div>
              <p className="text-gray-500 text-lg">Memuat wishlist...</p>
            </div>
          ) : wishlist.length === 0 ? (
            /* Empty State */
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-sm border border-pink-200 p-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="text-pink-300" size={48} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Wishlist Anda Kosong</h2>
                <p className="text-gray-500 mb-8">
                  Mulai tambahkan produk favorit Anda dan simpan untuk nanti!
                </p>
                <button
                  onClick={() => (window.location.href = "/products")}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-pink-400 text-white font-semibold rounded-xl hover:from-pink-500 hover:to-sky-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Package size={20} />
                  Jelajahi Produk
                </button>
              </div>
            </div>
          ) : (
            /* Product Grid */
            <>
              <div className="mb-6 text-gray-600 font-medium">
                Menampilkan {wishlist.length} produk dalam wishlist
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <div
                    key={item.wishlist_id}
                    className="bg-white/90 backdrop-blur-lg rounded-2xl overflow-hidden shadow-sm border border-pink-200 hover:shadow-lg transition-all duration-300 flex flex-col group"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      {item.product.primary_image ? (
                        <img
                          src={item.product.primary_image}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="text-gray-300" size={64} />
                        </div>
                      )}
                      <button
                        onClick={() => removeFromWishlist(item.product_id)}
                        className="absolute top-4 right-4 p-2.5 bg-white/95 hover:bg-white rounded-xl transition-all duration-300 shadow-lg hover:scale-110"
                      >
                        <Trash2 className="text-red-500" size={18} />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
                        {item.product.description || "Tidak ada deskripsi"}
                      </p>

                      {/* Price */}
                      <div className="mb-4">
                        <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-sky-500 bg-clip-text text-transparent">
                          Rp {item.product.price?.toLocaleString('id-ID') || "0"}
                        </span>
                      </div>

                      {/* Stock Status */}
                      <div className="mb-4">
                        {item.product.stock_quantity > 0 ? (
                          <div className="flex items-center gap-2 text-green-600 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="font-medium">Stok Tersedia ({item.product.stock_quantity})</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-red-600 text-sm">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="font-medium">Stok Habis</span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => addToCart(item.product_id)}
                        disabled={item.product.stock_quantity === 0}
                        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                          item.product.stock_quantity === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                            : "bg-gradient-to-r from-pink-400 to-sky-400 text-white hover:from-pink-500 hover:to-sky-500 shadow-lg hover:shadow-xl"
                        }`}
                      >
                        <ShoppingCart size={18} />
                        <span>{item.product.stock_quantity === 0 ? "Stok Habis" : "Tambah ke Keranjang"}</span>
                      </button>

                      {/* Added Date */}
                      <p className="text-gray-400 text-xs mt-4 text-center">
                        Ditambahkan {new Date(item.created_at).toLocaleDateString('id-ID', { 
                          day: 'numeric',
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;