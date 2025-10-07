import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, viewMode }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.product_id}`)}
      className={`cursor-pointer bg-white rounded-2xl overflow-hidden border 
      hover:shadow-2xl hover:shadow-pink-200/50 transition-all duration-300 
      hover:-translate-y-1 group ${viewMode === "list" ? "flex" : ""}`}
    >
      <div className="relative">
        <img
          src={product.image_url}
          alt={product.name}
          className={`object-cover transition-transform duration-300 group-hover:scale-105 
          ${viewMode === "list" ? "w-48 h-48" : "w-full h-56"}`}
        />
        <span className="absolute top-3 left-3 bg-gradient-to-r from-pink-400 to-sky-400 text-white text-xs px-2 py-1 rounded-lg shadow-md">Best Seller</span>
      </div>
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition">{product.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{product.desc}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-pink-600 font-semibold text-lg">{product.price}</span>
          <button
            className="bg-gradient-to-r from-pink-400 to-sky-400 text-white px-4 py-2 rounded-lg 
            hover:from-pink-500 hover:to-sky-500 transition-all shadow-md hover:shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              alert(`${product.name} ditambahkan ke keranjang!`);
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
