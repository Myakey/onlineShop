import React, { useState } from 'react';
import Navbar from '../components/layout/NavbarAdmin';
import Footer from '../components/layout/Footer';
import { Package, ShoppingCart, Users, DollarSign, AlertCircle, CheckCircle, Clock } from 'lucide-react';

import StatsCard from '../components/admin/StatsCard';
import OrderStatusCard from '../components/admin/OrderStatusCard';
import RecentOrders from '../components/admin/RecentOrders';
import TopProducts from '../components/admin/TopProducts';

// Mock data
const mockStats = { totalProducts: 48, totalOrders: 156, totalCustomers: 342, totalRevenue: 'Rp 45.750.000', pendingOrders: 12, completedOrders: 132, cancelledOrders: 12 };
const mockRecentOrders = [
  { id: 'ORD-001', customer: 'Siti Aminah', product: 'Teddy Bear Classic', amount: 'Rp 150.000', status: 'pending' },
  { id: 'ORD-002', customer: 'Budi Santoso', product: 'Bunny Plush White', amount: 'Rp 120.000', status: 'completed' }
];
const mockTopProducts = [
  { name: 'Teddy Bear Classic', sold: 45, revenue: 'Rp 6.750.000' },
  { name: 'Bunny Plush White', sold: 38, revenue: 'Rp 4.560.000' }
];

function AdminPage() {
  const [stats] = useState(mockStats);
  const [recentOrders] = useState(mockRecentOrders);
  const [topProducts] = useState(mockTopProducts);

  const getStatusBadge = (status) => {
    const config = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Menunggu' },
      processing: { color: 'bg-blue-100 text-blue-800', icon: Clock, text: 'Diproses' },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Selesai' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: AlertCircle, text: 'Dibatalkan' }
    }[status] || { color: 'bg-gray-100 text-gray-800', icon: Clock, text: status };

    const Icon = config.icon;
    return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}><Icon className="w-3 h-3" /> {config.text}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-cyan-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard Admin</h1>
          <p className="text-gray-600">Selamat datang kembali! Kelola toko boneka Anda dengan mudah.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard label="Total Produk" value={stats.totalProducts} Icon={Package} color="pink" />
          <StatsCard label="Total Pesanan" value={stats.totalOrders} Icon={ShoppingCart} color="blue" />
          <StatsCard label="Total Pelanggan" value={stats.totalCustomers} Icon={Users} color="purple" />
          <StatsCard label="Total Pendapatan" value={stats.totalRevenue} Icon={DollarSign} color="green" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <OrderStatusCard label="Pesanan Menunggu" value={stats.pendingOrders} Icon={Clock} color="yellow" />
          <OrderStatusCard label="Pesanan Selesai" value={stats.completedOrders} Icon={CheckCircle} color="green" />
          <OrderStatusCard label="Pesanan Dibatalkan" value={stats.cancelledOrders} Icon={AlertCircle} color="red" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <RecentOrders orders={recentOrders} getStatusBadge={getStatusBadge} />
          <TopProducts products={topProducts} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminPage;
