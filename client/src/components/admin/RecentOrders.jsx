import React from 'react';
import { ShoppingCart, Eye, MoreVertical } from 'lucide-react';

const RecentOrders = ({ orders = [] }) => {
  return (
    <div className="bg-white rounded-2xl border-2 border-pink-100 p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <ShoppingCart className="text-pink-600" size={24} /> Pesanan Terbaru
      </h3>
      <div className="space-y-4 mt-4">
        {orders.map((o, i) => (
          <div key={i} className="bg-pink-50 rounded-xl p-4 border-2 border-pink-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div>
                  <p className="font-bold text-gray-800">Customer Name</p>
                  <p className="text-xs text-gray-500">ORD-XXX • 12:00</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">Menunggu</span>
            </div>
            <div className="flex gap-2 pt-3 border-t border-pink-100">
              <button className="flex-1 px-3 py-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white rounded-lg text-sm font-bold">
                Proses Pesanan
              </button>
              <button className="px-3 py-2 bg-white border-2 border-pink-200 rounded-lg text-sm">
                <Eye size={16} />
              </button>
              <button className="px-3 py-2 bg-white border-2 border-cyan-200 rounded-lg text-sm">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;
