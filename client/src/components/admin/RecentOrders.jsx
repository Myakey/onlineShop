import React from 'react';
import { ShoppingCart, Eye, MoreVertical } from 'lucide-react';

const RecentOrders = ({ orders = [] }) => {
const OrderCard = ({ order }) => {
  const { order_id, user_id, status, created_at, total_amount } = order;

  const formattedDate = new Date(created_at).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-pink-50 rounded-xl p-4 border-2 border-pink-100 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          <div>
            <p className="font-bold text-gray-800">User #{user_id}</p>
            <p className="text-xs text-gray-500">
              ORD-{order_id} • {formattedDate}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
            statusColors[status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="flex justify-between items-center border-t border-pink-100 pt-3">
        <p className="text-sm font-semibold text-gray-700">
          Total: Rp {Number(total_amount).toLocaleString("id-ID")}
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-2 bg-white border-2 border-pink-200 rounded-lg text-sm">
            <Eye size={16} />
          </button>
          <button className="px-3 py-2 bg-white border-2 border-cyan-200 rounded-lg text-sm">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="bg-white rounded-2xl border-2 border-pink-100 p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <ShoppingCart className="text-pink-600" size={24} /> Pesanan Terbaru
      </h3>

      <div className="space-y-4 mt-4">
        {orders.length === 0 ? (
          <p className="text-gray-500 italic">Belum ada pesanan terbaru.</p>
        ) : (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
};

export default RecentOrders;
