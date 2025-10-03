import React from 'react';
import { Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const TopProducts = ({ products = [1,2,3] }) => {
  return (
    <div className="bg-white rounded-2xl border-2 border-pink-100 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Star className="text-pink-600 fill-pink-600" size={24} /> Top Produk
        </h3>
      </div>

      <div className="space-y-4">
        {products.map((p, i) => (
          <div key={i} className="bg-pink-50 rounded-xl p-4 border-2 border-pink-100 hover:shadow-md transition-all">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Produk {i+1}</p>
                    <p className="text-xs text-gray-500 mt-1">Terjual: 10 unit</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                    <ArrowUpRight size={12} /> +5%
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm pt-3 border-t border-pink-100">
              <span className="text-pink-600 font-bold">Rp 100.000</span>
              <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full font-semibold">Stok: 10</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;
