import React, { useEffect, useState } from "react";
import NavbarAdmin from "../components/layout/NavbarAdmin";
import StatsCard from "../components/admin/StatsCard";
import OrderStatusCard from "../components/admin/OrderStatusCard";
import RecentOrders from "../components/admin/RecentOrders";
import TopProducts from "../components/admin/TopProducts";
import RevenueChart from "../components/admin/RevenueChart";
import productService from "../services/productService";
import orderService from "../services/orderService";
import { Package, ShoppingCart, Users, DollarSign, FileDown } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable"; // 🔹 WAJIB ditambahkan agar doc.autoTable() berfungsi

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
  const [allOrders, setAllOrders] = useState([]); // 🔹 Tambahkan state untuk semua orders
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
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
        setAllOrders(ordersData); // 🔹 Simpan semua orders

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleExportPDF = () => {
    // 🔹 Cek apakah data sudah dimuat
    if (isLoading) {
      alert("Data masih dimuat, mohon tunggu sebentar...");
      return;
    }

    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(16);
    doc.text("LAPORAN ADMIN", 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Tanggal: ${new Date().toLocaleDateString("id-ID")}`, 15, 25);

    // 📊 Statistik
    doc.setFontSize(12);
    doc.text("Statistik Ringkas:", 15, 35);
    doc.setFontSize(10);
    doc.text(`• Total Produk: ${stats.totalProducts}`, 20, 42);
    doc.text(`• Total Pesanan: ${stats.totalOrders}`, 20, 48);
    doc.text(`• Total Pelanggan: ${stats.totalCustomers}`, 20, 54);
    doc.text(`• Total Pendapatan: ${stats.totalRevenue}`, 20, 60);

    // 🧾 Daftar Produk
    doc.setFontSize(12);
    doc.text("Daftar Produk", 15, 75);

    const productTable = Array.isArray(products) && products.length > 0
      ? products.map((p, index) => [
          index + 1,
          p.name || "-",
          `Rp ${Number(p.price || 0).toLocaleString("id-ID")}`,
          p.stock ?? "-",
        ])
      : [["-", "Tidak ada data produk", "-", "-"]];

    doc.autoTable({
      startY: 80,
      head: [["#", "Nama Produk", "Harga", "Stok"]],
      body: productTable,
      theme: "striped",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [255, 182, 193] }, // pink
    });

    // 📦 Daftar Pesanan
    let finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text("Daftar Pesanan", 15, finalY);

    // 🔹 Gunakan allOrders (semua pesanan) bukan orders yang tidak terdefinisi
    const orderTable = Array.isArray(allOrders) && allOrders.length > 0
      ? allOrders.map((o, index) => [
          index + 1,
          o.order_number || "-",
          o.user?.first_name ? `${o.user.first_name} ${o.user.last_name || ""}` : "N/A",
          o.payment_status || "-",
          o.status || "-",
          `Rp ${parseFloat(o.total_amount || 0).toLocaleString("id-ID")}`,
        ])
      : [["-", "Tidak ada data pesanan", "-", "-", "-", "-"]];

    doc.autoTable({
      startY: finalY + 5,
      head: [["#", "No. Order", "Customer", "Status Bayar", "Status Pesanan", "Total"]],
      body: orderTable,
      theme: "striped",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [173, 216, 230] }, // light blue
    });

    doc.save(`Laporan-Admin-${new Date().toLocaleDateString("id-ID")}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50">
      <NavbarAdmin />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tombol Export PDF */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleExportPDF}
            disabled={isLoading}
            className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FileDown size={20} />
            {isLoading ? "Memuat Data..." : "Export ke PDF"}
          </button>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard label="Total Produk" value={stats.totalProducts} Icon={Package} color="pink" />
          <StatsCard label="Total Pesanan" value={stats.totalOrders} Icon={ShoppingCart} color="blue" />
          <StatsCard label="Total Pelanggan" value={stats.totalCustomers} Icon={Users} color="purple" />
          <StatsCard label="Total Pendapatan" value={stats.totalRevenue} Icon={DollarSign} color="green" />
        </div>

        {/* Status Pesanan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <OrderStatusCard type="pending" count={orderStatusCount.pending} />
          <OrderStatusCard type="completed" count={orderStatusCount.completed} />
          <OrderStatusCard type="cancelled" count={orderStatusCount.cancelled} />
        </div>

        {/* Daftar Pesanan & Produk */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentOrders orders={recentOrders} />
          </div>
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