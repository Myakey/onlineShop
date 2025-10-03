import React from 'react';
import NavbarAdmin from '../components/layout/NavbarAdmin';
import StatsCard from '../components/admin/StatsCard';
import OrderStatusCard from '../components/admin/OrderStatusCard';
import RecentOrders from '../components/admin/RecentOrders';
import TopProducts from '../components/admin/TopProducts';
import RevenueChart from '../components/admin/RevenueChart';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50">
      {/* Navbar */}
      <NavbarAdmin />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard label="Total Produk" value="48" Icon={Package} color="pink" growth="+5%" />
          <StatsCard label="Total Pesanan" value="156" Icon={ShoppingCart} color="blue" growth="+8%" />
          <StatsCard label="Total Pelanggan" value="342" Icon={Users} color="purple" growth="+15%" />
          <StatsCard label="Total Pendapatan" value="Rp 45.750.000" Icon={DollarSign} color="green" growth="+12%" />
        </div>

        {/* Order Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <OrderStatusCard type="pending" count={12} />
          <OrderStatusCard type="completed" count={132} />
          <OrderStatusCard type="cancelled" count={12} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <RecentOrders orders={[1,2,3,4,5]} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TopProducts products={[1,2,3]} />
            <RevenueChart data={[25,30,28,35,40,38,45]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
