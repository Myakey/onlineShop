import React from "react";
import { Sparkles } from "lucide-react";

const ProductGrid = ({ products, onDelete }) => (
  <div>
    <div className="text-center mb-16">
      <div className="inline-flex items-center space-x-2 bg-purple-500/10 px-6 py-2 rounded-full mb-4">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <span className="text-purple-400 font-semibold">Menu Populer</span>
      </div>
      <h2 className="text-5xl font-black text-white mb-4">Pilihan Terfavorit</h2>
      <p className="text-gray-400 text-lg">Hidangan terlaris yang wajib Anda coba</p>
    </div>
    
    <div className="grid md:grid-cols-3 gap-8">
      {products.map((product) => (
        <div key={product.product_id} className="group relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2">
          <div className="aspect-video bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center text-6xl">
            🍔
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text">
                {product.price}
              </span>
              <button 
                onClick={() => onDelete(product.product_id)}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Pesan
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ProductGrid;
