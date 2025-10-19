import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "../../context/cartContext";
import reviewService from "../../services/reviewService";

const ProductCard = ({ product, viewMode = "grid" }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [reviewSummary, setReviewSummary] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch review summary when component mounts
  useEffect(() => {
    fetchReviewSummary();
    console.log("PRODUCTS", product)
  }, [product.product_id]);

  const fetchReviewSummary = async () => {
    try {
      const response = await reviewService.getProductReviewStats(product.product_id);
      if (response.success) {
        setReviewSummary(response.data);
      }
    } catch (err) {
      console.error("Error fetching review summary:", err);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    try {
      setAddingToCart(true);
      await addItem(product.product_id, 1);
      alert(`${product.name} berhasil ditambahkan ke keranjang!`);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Gagal menambahkan ke keranjang. Silakan coba lagi.");
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = (price) => {
    return `Rp ${Number(price).toLocaleString('id-ID')}`;
  };

  const getRating = () => {
    return reviewSummary?.average_rating || 0;
  };

  const getTotalReviews = () => {
    return reviewSummary?.total_reviews || 0;
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.product_id}`)}
      className={`cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100
      hover:shadow-2xl hover:shadow-pink-200/50 transition-all duration-300 
      hover:-translate-y-1 group ${viewMode === "list" ? "flex" : ""}`}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={product.image_url || "https://via.placeholder.com/400"}
          alt={product.name}
          className={`object-cover transition-transform duration-300 group-hover:scale-105 
          ${viewMode === "list" ? "w-48 h-48" : "w-full h-56"}`}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400?text=No+Image";
          }}
        />
        
        {/* Badge */}
        {product.stock < 10 && product.stock > 0 ? (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-red-400 to-orange-400 text-white text-xs px-3 py-1 rounded-lg shadow-md font-semibold">
            Stok Terbatas
          </span>
        ) : product.stock === 0 ? (
          <span className="absolute top-3 left-3 bg-gray-500 text-white text-xs px-3 py-1 rounded-lg shadow-md font-semibold">
            Habis
          </span>
        ) : (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-pink-400 to-sky-400 text-white text-xs px-3 py-1 rounded-lg shadow-md font-semibold">
            Best Seller
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition line-clamp-2">
            {product.name}
          </h3>
          
          {/* Star Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.round(getRating())
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {getRating() > 0 ? (
                <>
                  {getRating().toFixed(1)} ({getTotalReviews()})
                </>
              ) : (
                "Belum ada review"
              )}
            </span>
          </div>

          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {product.description || "Produk berkualitas tinggi"}
          </p>

          {/* Stock Info */}
          {product.stock !== undefined && (
            <p className="text-xs text-gray-400 mb-2">
              Stok: {product.stock > 0 ? product.stock : "Habis"}
            </p>
          )}
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-pink-600 font-bold text-xl flex-shrink-0">
            {formatPrice(product.price)}
          </span>
          <button
            className="bg-gradient-to-r from-pink-400 to-sky-400 text-white px-4 py-2 rounded-lg 
            hover:from-pink-500 hover:to-sky-500 transition-all shadow-md hover:shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 flex-shrink-0"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addingToCart}
          >
            <ShoppingCart size={16} />
            <span className="text-sm font-semibold">
              {addingToCart ? "..." : "Add"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;