import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import NavbarAdmin from '../components/layout/NavbarAdmin';
import StatsCard from '../components/admin/StatsCard';
import OrderStatusCard from '../components/admin/OrderStatusCard';
import RecentOrders from '../components/admin/RecentOrders';
import TopProducts from '../components/admin/TopProducts';
import RevenueChart from '../components/admin/RevenueChart';
import { Package, ShoppingCart, Users, DollarSign, Printer } from 'lucide-react';

const AdminPage = () => {
  const componentRef = useRef();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 156,
    totalCustomers: 342,
    totalRevenue: "Rp 45.750.000",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/products");
        const data = await res.json();

        setStats(prev => ({
          ...prev,
          totalProducts: data.length,
        }));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchStats();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Admin-Dashboard-${new Date().toLocaleDateString()}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
      }
    `
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50">
      {/* Navbar */}
      <NavbarAdmin />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Print Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <Printer size={20} />
            Export ke PDF
          </button>
        </div>

        {/* Printable Content */}
        <div ref={componentRef}>
          {/* Header untuk Print */}
          <div className="hidden print:block mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
            <p className="text-gray-600">Tanggal: {new Date().toLocaleDateString('id-ID')}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard label="Total Produk" value={stats.totalProducts} Icon={Package} color="pink" />
            <StatsCard label="Total Pesanan" value={stats.totalOrders} Icon={ShoppingCart} color="blue" growth="+8%" />
            <StatsCard label="Total Pelanggan" value={stats.totalCustomers} Icon={Users} color="purple" growth="+15%" />
            <StatsCard label="Total Pendapatan" value={stats.totalRevenue} Icon={DollarSign} color="green" growth="+12%" />
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
              <RecentOrders orders={[1, 2, 3, 4, 5]} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <TopProducts products={[1, 2, 3]} />
              <RevenueChart data={[25, 30, 28, 35, 40, 38, 45]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;