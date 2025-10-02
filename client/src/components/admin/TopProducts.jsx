import React from 'react';
import { TrendingUp } from 'lucide-react';

const TopProducts = ({ products }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <div className="flex items-center gap-2 mb-6">
      <TrendingUp className="w-6 h-6 text-pink-600" />
      <h2 className="text-2xl font-bold text-gray-800">Produk Terlaris</h2>
    </div>
    <div className="space-y-4">
      {products.map((product, index) => (
        <div key={index} className="p-4 bg-gradient-to-r from-pink-50 to-cyan-50 rounded-xl hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800 text-sm">{product.name}</h3>
            <span className="bg-pink-100 text-pink-700 text-xs font-bold px-2 py-1 rounded-full">#{index + 1}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Terjual: <span className="font-semibold text-gray-800">{product.sold}</span></span>
            <span className="font-semibold text-green-600">{product.revenue}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TopProducts;
