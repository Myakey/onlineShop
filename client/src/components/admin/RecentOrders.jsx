import React from 'react';

const RecentOrders = ({ orders, getStatusBadge }) => (
  <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Pesanan Terbaru</h2>
      <a href="/order" className="text-pink-600 hover:text-pink-700 font-medium text-sm">Lihat Semua →</a>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ID Pesanan</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Pelanggan</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Produk</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Total</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-4 px-4 text-sm font-medium text-gray-800">{order.id}</td>
              <td className="py-4 px-4 text-sm text-gray-700">{order.customer}</td>
              <td className="py-4 px-4 text-sm text-gray-600">{order.product}</td>
              <td className="py-4 px-4 text-sm font-semibold text-gray-800">{order.amount}</td>
              <td className="py-4 px-4">{getStatusBadge(order.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default RecentOrders;
