import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Minus,
  Plus,
  Star,
  ArrowLeft,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import ReviewCard from "../../components/review/ReviewCard";
import ReviewStats from "../../components/review/ReviewStats";
import ReviewFilters from "../../components/review/ReviewFilters";
import reviewService from "../../services/reviewService";
import wishlistService from "../../services/wishList";
import { useCart } from "../../context/cartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewFilters, setReviewFilters] = useState({
    page: 1,
    limit: 10,
    rating: null,
    sort: "recent",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8080/api/products/${id}`);
        const data = await res.json();

        const formattedProduct = {
          ...data,
          price: parseFloat(data.price),
          images: data.images && data.images.length > 0 
            ? data.images 
            : data.image_url 
            ? [{ image_url: data.image_url }] 
            : [],
        };

        setProduct(formattedProduct);
        checkWishlistStatus(formattedProduct.product_id);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const checkWishlistStatus = async (productId) => {
    try {
      const response = await wishlistService.checkWishlist(productId);
      if (response.success) {
        setIsInWishlist(response.data.inWishlist);
      }
    } catch (err) {
      console.error("Error checking wishlist:", err);
    }
  };

  const toggleWishlist = async () => {
    if (!product) return;

    try {
      setWishlistLoading(true);
      
      if (isInWishlist) {
        const response = await wishlistService.removeFromWishlist(product.product_id);
        if (response.success) {
          setIsInWishlist(false);
          alert("Produk dihapus dari wishlist!");
        }
      } else {
        const response = await wishlistService.addToWishlist(product.product_id);
        if (response.success) {
          setIsInWishlist(true);
          alert("Produk ditambahkan ke wishlist!");
        }
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
      alert("Gagal mengubah wishlist. Silakan coba lagi.");
    } finally {
      setWishlistLoading(false);
    }
  };

  useEffect(() => {
    if (!isAutoPlaying || !product?.images?.length || product.images.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, product?.images?.length]);

  useEffect(() => {
    if (product?.product_id) {
      fetchReviews();
      fetchReviewStats();
    }
  }, [product?.product_id, reviewFilters]);

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await reviewService.getProductReviews(
        product.product_id,
        reviewFilters
      );

      if (response.success) {
        setReviews(response.data.reviews || []);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchReviewStats = async () => {
    try {
      const response = await reviewService.getProductReviewStats(
        product.product_id
      );
      if (response.success) {
        setReviewStats(response.data);
      }
    } catch (err) {
      console.error("Error fetching review stats:", err);
    }
  };

  const handleQuantityChange = (change) => {
    const newQty = quantity + change;
    if (newQty >= 1 && newQty <= (product?.stock || 999)) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAddingToCart(true);
      await addItem(product.product_id, quantity);
      alert(`${quantity}x ${product.name} berhasil ditambahkan ke keranjang!`);
      setQuantity(1);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Gagal menambahkan ke keranjang. Silakan coba lagi.");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    try {
      setAddingToCart(true);
      await addItem(product.product_id, quantity);
      navigate("/cart");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Gagal menambahkan ke keranjang. Silakan coba lagi.");
      setAddingToCart(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus review ini?"))
      return;

    try {
      const response = await reviewService.deleteReview(reviewId);
      if (response.success) {
        alert("Review berhasil dihapus!");
        fetchReviews();
        fetchReviewStats();
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Gagal menghapus review. Silakan coba lagi.");
    }
  };

  const handleFilterChange = (filters) => {
    setReviewFilters((prev) => ({ ...prev, ...filters, page: 1 }));
  };

  const nextImage = () => {
    if (product?.images?.length > 1) {
      setSelectedImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
      setIsAutoPlaying(false);
    }
  };

  const prevImage = () => {
    if (product?.images?.length > 1) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
      setIsAutoPlaying(false);
    }
  };

  const getCurrentImage = () => {
    if (product?.images?.length > 0 && product.images[selectedImageIndex]) {
      return product.images[selectedImageIndex].image_url || "https://via.placeholder.com/500";
    }
    return "https://via.placeholder.com/500";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-pink-50 to-sky-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-pink-50 to-sky-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-xl mb-4">Produk tidak ditemukan</p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-3 bg-gradient-to-r from-pink-400 to-sky-400 text-white rounded-xl hover:from-pink-500 hover:to-sky-500"
            >
              Kembali ke Produk
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const hasMultipleImages = product?.images?.length > 1;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-pink-50 to-sky-50">
      <Navbar />

      <div className="flex-1 p-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-gradient-to-r from-pink-400 to-sky-400 text-white rounded-lg shadow hover:from-pink-500 hover:to-sky-500 flex items-center gap-2 transition-all"
        >
          <ArrowLeft size={20} />
          Kembali
        </button>

        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative bg-gradient-to-br from-pink-50 to-sky-50 p-8">
              <div className="relative mb-6 rounded-2xl overflow-hidden bg-white">
                <div className="relative h-96 flex items-center justify-center">
                  <img
                    src={getCurrentImage()}
                    alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-full object-contain transition-opacity duration-500"
                    key={selectedImageIndex}
                  />
                </div>

                {hasMultipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
                    >
                      <ChevronLeft size={24} className="text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
                    >
                      <ChevronRight size={24} className="text-gray-700" />
                    </button>

                    <button
                      onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                      className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold transition-all z-10 ${
                        isAutoPlaying 
                          ? "bg-pink-500 text-white" 
                          : "bg-white/90 text-gray-700 hover:bg-white"
                      }`}
                    >
                      {isAutoPlaying ? "⏸ Pause" : "▶ Auto"}
                    </button>

                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                      {selectedImageIndex + 1} / {product.images.length}
                    </div>
                  </>
                )}

                <button
                  onClick={toggleWishlist}
                  disabled={wishlistLoading}
                  className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all hover:scale-110 z-20 ${
                    isInWishlist
                      ? "bg-pink-500 text-white"
                      : "bg-white/90 hover:bg-white text-gray-700"
                  } ${wishlistLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  title={isInWishlist ? "Hapus dari wishlist" : "Tambah ke wishlist"}
                >
                  <Heart
                    size={24}
                    fill={isInWishlist ? "currentColor" : "none"}
                    className="transition-all"
                  />
                </button>

                {product.stock < 10 && product.stock > 0 && (
                  <div className="absolute top-16 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                    Stok Terbatas!
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute top-16 right-4 bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                    Habis
                  </div>
                )}
              </div>

              {hasMultipleImages && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex gap-3 px-4">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedImageIndex(index);
                            setIsAutoPlaying(false);
                          }}
                          className={`relative flex-shrink-0 transition-all duration-300 ${
                            selectedImageIndex === index
                              ? "w-24 h-24 scale-110"
                              : "w-20 h-20 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <div
                            className={`w-full h-full rounded-2xl overflow-hidden transition-all ${
                              selectedImageIndex === index
                                ? "border-3 border-pink-500 shadow-xl ring-4 ring-pink-200"
                                : "border-2 border-gray-300 hover:border-pink-300 shadow-md"
                            }`}
                          >
                            <img
                              src={image.image_url || "https://via.placeholder.com/100"}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {selectedImageIndex === index && (
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center gap-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedImageIndex(index);
                          setIsAutoPlaying(false);
                        }}
                        className={`transition-all ${
                          selectedImageIndex === index
                            ? "w-8 h-2 bg-pink-500"
                            : "w-2 h-2 bg-gray-300 hover:bg-pink-300"
                        } rounded-full`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h1 className="text-4xl font-bold text-gray-800 flex-1">
                    {product.name}
                  </h1>
                  <button
                    onClick={toggleWishlist}
                    disabled={wishlistLoading}
                    className={`p-2 rounded-full transition-all hover:scale-110 ${
                      isInWishlist
                        ? "bg-pink-100 text-pink-500"
                        : "bg-gray-100 text-gray-400 hover:bg-pink-50 hover:text-pink-400"
                    } ${wishlistLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    title={isInWishlist ? "Hapus dari wishlist" : "Tambah ke wishlist"}
                  >
                    <Heart
                      size={24}
                      fill={isInWishlist ? "currentColor" : "none"}
                      className="transition-all"
                    />
                  </button>
                </div>

                {reviewStats && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          fill={
                            i < Math.round(reviewStats.average_rating)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">
                      ({reviewStats.average_rating.toFixed(1)} dari 5 •{" "}
                      {reviewStats.total_reviews} review)
                    </span>
                  </div>
                )}

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {product.description ||
                    "Produk berkualitas tinggi dengan bahan lembut dan nyaman."}
                </p>

                <div className="mb-6">
                  <p className="text-4xl font-bold text-pink-600">
                    Rp {product.price.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    Stok tersedia:{" "}
                    <span className="font-semibold text-gray-800">
                      {product.stock}
                    </span>
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jumlah
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus size={20} />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        if (val >= 1 && val <= product.stock) {
                          setQuantity(val);
                        }
                      }}
                      className="w-20 h-10 text-center border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-400"
                    />
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addingToCart}
                  className="w-full bg-gradient-to-r from-pink-400 to-sky-400 text-white py-4 px-6 rounded-xl hover:from-pink-500 hover:to-sky-500 shadow-lg hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingToCart ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Menambahkan...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      Tambahkan ke Keranjang
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0 || addingToCart}
                  className="w-full bg-gradient-to-r from-purple-400 to-indigo-400 text-white py-4 px-6 rounded-xl hover:from-purple-500 hover:to-indigo-500 shadow-lg hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Beli Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Customer Reviews
          </h2>

          {reviewsLoading ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Memuat reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <p className="text-gray-500">
                Belum ada review untuk produk ini.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Jadilah yang pertama memberikan review!
              </p>
            </div>
          ) : (
            <>
              {reviewStats && <ReviewStats stats={reviewStats} />}
              <ReviewFilters
                onFilterChange={handleFilterChange}
                currentFilters={reviewFilters}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.review_id}
                    review={review}
                    onDelete={handleDeleteReview}
                  />
                ))}
              </div>

              {reviews.length >= reviewFilters.limit && (
                <div className="flex justify-center mt-8 gap-2">
                  <button
                    onClick={() =>
                      setReviewFilters((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                    disabled={reviewFilters.page === 1}
                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-pink-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-white border-2 border-pink-400 rounded-lg">
                    {reviewFilters.page}
                  </span>
                  <button
                    onClick={() =>
                      setReviewFilters((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-pink-400"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;