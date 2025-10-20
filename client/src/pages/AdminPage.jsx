import React, { useEffect, useState } from "react";
import NavbarAdmin from "../components/layout/NavbarAdmin";
import StatsCard from "../components/admin/StatsCard";
import OrderStatusCard from "../components/admin/OrderStatusCard";
import RecentOrders from "../components/admin/RecentOrders";
import TopProducts from "../components/admin/TopProducts";
import RevenueChart from "../components/admin/RevenueChart";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";

import productService from "../services/productService";
import orderService from "../services/orderService";

const AdminPage = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: "Rp 0",
  });

  const [orderStatusCount, setOrderStatusCount] = useState({
    pending: 0,
    completed: 0,
    cancelled: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("No token found — please login first.");
          return;
        }

        // Fetch both via services
        const [productsRes, ordersRes] = await Promise.all([
          productService.getProducts(),
          orderService.getAllOrders(),
        ]);

        // Extract actual data
        const productsData = Array.isArray(productsRes.data)
        ? productsRes.data
        : productsRes.data?.data || [];
        const ordersData = ordersRes.data || [];

        setProducts(productsData);

        const pendingCount = ordersData.filter((o) => o.status === "pending").length;
        const completedCount = ordersData.filter((o) => o.status === "delivered").length;
        const cancelledCount = ordersData.filter((o) => o.status === "cancelled").length;

        setOrderStatusCount({
          pending: pendingCount,
          completed: completedCount,
          cancelled: cancelledCount,
        });

        const sortedOrders = ordersData.sort((a, b) => b.order_id - a.order_id);
        setRecentOrders(sortedOrders.slice(0, 5));

        const uniqueCustomerIds = new Set(ordersData.map((o) => o.user_id));
        const customerCount = uniqueCustomerIds.size;
        const totalRevenue =
          "Rp " +
          ordersData
            .reduce((sum, o) => sum + parseFloat(o.total_amount ?? 0), 0)
            .toLocaleString("id-ID");

        setStats({
          totalProducts: productsData.length,
          totalOrders: ordersData.length,
          totalCustomers: customerCount,
          totalRevenue,
        });
      } catch (err) {
        console.error("❌ Failed to fetch admin dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50">
      <NavbarAdmin />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard label="Total Produk" value={stats.totalProducts} Icon={Package} color="pink" />
          <StatsCard label="Total Pesanan" value={stats.totalOrders} Icon={ShoppingCart} color="blue" />
          <StatsCard label="Total Pelanggan" value={stats.totalCustomers} Icon={Users} color="purple" />
          <StatsCard label="Total Pendapatan" value={stats.totalRevenue} Icon={DollarSign} color="green" />
        </div>

        {/* Order Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <OrderStatusCard type="pending" count={orderStatusCount.pending} />
          <OrderStatusCard type="completed" count={orderStatusCount.completed} />
          <OrderStatusCard type="cancelled" count={orderStatusCount.cancelled} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <RecentOrders orders={recentOrders} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TopProducts products={products.slice(0, 3)} />
            {/* <RevenueChart data={[25, 30, 28, 35, 40, 38, 45]} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
