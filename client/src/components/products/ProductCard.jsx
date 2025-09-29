//Template Buat Product Card, tinggal design ini dah!

import React from "react";

function ProductCard({ product, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 max-w-sm">
      {/* Product Image */}
      <div className="mb-4">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-48 object-cover rounded-md"
            onError={(e) => {
              e.target.src = "/placeholder-image.jpg"; // Fallback image
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-3 text-sm">{product.description}</p>

      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-green-600">
          ${parseFloat(product.price).toFixed(2)}
        </span>
        <span
          className={`px-2 py-1 rounded text-sm ${
            product.stock > 0
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </span>
      </div>

      {/* Add to Cart Button (optional) */}
      <button
        className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        disabled={product.stock === 0}
      >
        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
      </button>

      <button
        className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        disabled={product.stock === 0}
        onClick={() => {
          console.log("Button clicked, product:", product);
          onDelete(product.product_id);
        }}
      >
        Delete
      </button>
    </div>
  );
}

export default ProductCard;
