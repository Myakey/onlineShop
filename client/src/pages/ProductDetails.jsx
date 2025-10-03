// src/pages/ProductDetails.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ReviewCard from "../components/review/ReviewCard";
import ReviewStats from "../components/review/ReviewStats";
import ReviewFilters from "../components/review/ReviewFilters";

const ProductDetails = () => {
  const { id } = useParams(); // ambil product_id dari URL
  const navigate = useNavigate();

  // Data produk sementara
  const mockProducts = [
    { id: 1, name: "Teddy Bear Classic", price: "$25.99", desc: "Boneka beruang klasik, lembut dan nyaman dipeluk.", image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=500" },
    { id: 2, name: "Bunny Plush White", price: "$19.99", desc: "Boneka kelinci putih imut dengan telinga panjang.", image: "https://images.unsplash.com/photo-1612549244923-d72b9d34658f?w=500" },
    { id: 3, name: "Pink Unicorn Doll", price: "$29.99", desc: "Unicorn pink dengan tanduk emas yang elegan.", image: "https://images.unsplash.com/photo-1620035279440-867a58b35b13?w=500" },
  ];

  const product = mockProducts.find(p => p.id === parseInt(id));

  // Mock reviews berdasarkan product_id
  const initialReviews = [
    { id: 1, product_id: 1, title: "Sangat lucu!", body: "Bonekanya lembut dan nyaman dipeluk.", rating: 5, reviewer: "Alice", date: "1 Oct" },
    { id: 2, product_id: 1, title: "Bagus tapi kecil", body: "Ukuran lebih kecil dari ekspektasi.", rating: 4, reviewer: "Bob", date: "3 Oct" },
    { id: 3, product_id: 2, title: "Imut banget", body: "Kelinci putihnya menggemaskan.", rating: 5, reviewer: "Charlie", date: "5 Oct" },
    { id: 4, product_id: 3, title: "Unicorn cantik", body: "Tanduk emasnya membuat unicorn ini spesial.", rating: 5, reviewer: "Diana", date: "6 Oct" },
  ];

  const [reviews, setReviews] = useState(initialReviews.filter(r => r.product_id === parseInt(id)));

  const handleDeleteReview = (rid) => setReviews(reviews.filter(r => r.id !== rid));
  const handleReply = (rid) => console.log("Reply to review:", rid);

  if (!product) {
    return (
      <div>
        <Navbar />
        <p className="text-center mt-20 text-gray-500">Produk tidak ditemukan</p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-pink-50 to-sky-50">
      <Navbar />

      {/* Konten utama */}
      <div className="flex-1 p-8">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 px-4 py-2 bg-gradient-to-r from-pink-400 to-sky-400 text-white rounded-lg shadow hover:from-pink-500 hover:to-sky-500"
        >
          ← Kembali
        </button>

        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 mb-12">
          <img src={product.image} alt={product.name} className="w-full h-96 object-cover" />
          <div className="p-8 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-6">{product.desc}</p>
              <p className="text-pink-600 text-2xl font-bold mb-4">{product.price}</p>
            </div>
            <button className="bg-gradient-to-r from-pink-400 to-sky-400 text-white py-3 px-6 rounded-xl hover:from-pink-500 hover:to-sky-500 shadow-lg">
              Tambahkan ke Keranjang
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Customer Reviews</h2>
          
          {reviews.length === 0 ? (
            <p className="text-gray-500">Belum ada review untuk produk ini.</p>
          ) : (
            <>
              <ReviewStats reviews={reviews} />
              <ReviewFilters />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {reviews.map(review => (
                  <ReviewCard key={review.id} review={review} onDelete={handleDeleteReview} onReply={handleReply} />
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

export default ProductDetails;
