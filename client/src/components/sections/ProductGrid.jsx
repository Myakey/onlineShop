import React from "react";
import { Sparkles } from "lucide-react";

const ProductGrid = ({ products, onDelete }) => (
  <section className="py-24 px-6 bg-gradient-to-br from-pink-50 via-white to-cyan-50">
    <div className="max-w-7xl mx-auto">
      
      {/* Header Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-cyan-100 px-6 py-2 rounded-full mb-4 shadow-sm">
          <Sparkles className="w-5 h-5 text-pink-500" />
          <span className="text-pink-600 font-semibold">Boneka Favorit</span>
        </div>
        <h2 className="text-5xl font-black text-gray-900 mb-4">
          Koleksi Terpopuler
        </h2>
        <p className="text-gray-600 text-lg">
          Boneka yang paling banyak disukai dan dicari pelanggan kami ✨
        </p>
      </div>
      
      {/* Product Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div 
            key={product.product_id} 
            className="group relative bg-white border border-pink-100 rounded-3xl overflow-hidden hover:border-pink-400 transition-all duration-500 transform hover:-translate-y-3 shadow-sm hover:shadow-2xl"
          >
            {/* Thumbnail Produk */}
            <div className="aspect-video bg-gradient-to-br from-pink-100/40 to-cyan-100/40 flex items-center justify-center text-6xl">
              🧸
            </div>
            
            {/* Konten */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-transparent bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text">
                  {product.price}
                </span>
                <button 
                  onClick={() => onDelete(product.product_id)}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Beli
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductGrid;
