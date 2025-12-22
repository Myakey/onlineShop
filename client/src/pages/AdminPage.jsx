import React, { useEffect, useState } from "react";
import NavbarAdmin from "../components/layout/NavbarAdmin";
import StatsCard from "../components/admin/StatsCard";
import OrderStatusCard from "../components/admin/OrderStatusCard";
import RecentOrders from "../components/admin/RecentOrders";
import TopProducts from "../components/admin/TopProducts";
import Footer from "../components/layout/Footer";
import RevenueChart from "../components/admin/RevenueChart";
import productService from "../services/productService";
import orderService from "../services/orderService";
import { Package, ShoppingCart, Users, DollarSign, FileDown, TrendingUp, Activity } from "lucide-react";
// Import jsPDF dan autoTable
import jsPDF from "jspdf";
import "jspdf-autotable";

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
  const [allOrders, setAllOrders] = useState([]);
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

        const [productsRes, ordersRes] = await Promise.all([
          productService.getProducts(),
          orderService.getAllOrders(),
        ]);

        const productsData = Array.isArray(productsRes.data)
        ? productsRes.data
        : productsRes.data?.data || [];
        const ordersData = ordersRes.data || [];

        setProducts(productsData);
        setAllOrders(ordersData);

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
    if (isLoading) {
      alert("Data masih dimuat, mohon tunggu sebentar...");
      return;
    }

    try {
      const doc = new jsPDF("p", "mm", "a4");
      
      // Header
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("LAPORAN ADMIN", 105, 15, { align: "center" });
      
      // Tanggal
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Tanggal: ${new Date().toLocaleDateString("id-ID", { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`, 15, 25);

      // Statistik Ringkas
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Statistik Ringkas", 15, 35);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Total Produk: ${stats.totalProducts}`, 20, 42);
      doc.text(`Total Pesanan: ${stats.totalOrders}`, 20, 48);
      doc.text(`Total Pelanggan: ${stats.totalCustomers}`, 20, 54);
      doc.text(`Total Pendapatan: ${stats.totalRevenue}`, 20, 60);

      // Status Pesanan
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Status Pesanan", 15, 70);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Pending: ${orderStatusCount.pending}`, 20, 77);
      doc.text(`Selesai: ${orderStatusCount.completed}`, 70, 77);
      doc.text(`Dibatalkan: ${orderStatusCount.cancelled}`, 120, 77);

      // Tabel Produk
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Daftar Produk", 15, 90);

      const productTable = Array.isArray(products) && products.length > 0
        ? products.map((p, index) => [
            index + 1,
            p.name || "-",
            `Rp ${Number(p.price || 0).toLocaleString("id-ID")}`,
            p.stock ?? "-",
          ])
        : [["-", "Tidak ada data produk", "-", "-"]];

      doc.autoTable({
        startY: 95,
        head: [["No", "Nama Produk", "Harga", "Stok"]],
        body: productTable,
        theme: "grid",
        styles: { 
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: { 
          fillColor: [255, 182, 193],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });

      // Tabel Pesanan
      let finalY = doc.lastAutoTable.finalY + 10;
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Daftar Pesanan", 15, finalY);

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
        head: [["No", "No. Order", "Customer", "Status Bayar", "Status", "Total"]],
        body: orderTable,
        theme: "grid",
        styles: { 
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: { 
          fillColor: [173, 216, 230],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 30 },
          2: { cellWidth: 35 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25 },
          5: { cellWidth: 35 },
        },
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128);
        doc.text(
          `Halaman ${i} dari ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }

      // Save PDF
      const fileName = `Laporan-Admin-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      // Show success message
      alert("PDF berhasil diunduh!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Gagal membuat PDF. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50">
      <NavbarAdmin />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Dashboard Admin
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Activity size={16} />
              Monitoring real-time system performance
            </p>
          </div>
          
          {/* Export Button */}
          <button
            onClick={handleExportPDF}
            disabled={isLoading}
            className={`group relative px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white rounded-xl font-medium overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-2">
              <FileDown size={20} className="group-hover:rotate-12 transition-transform duration-300" />
              {isLoading ? "Memuat Data..." : "Export ke PDF"}
            </div>
          </button>
        </div>

        {/* Stats Cards Row - Kompak & Premium */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <Package className="text-white/80" size={32} />
                <span className="text-xs font-semibold text-white/70 bg-white/20 px-3 py-1 rounded-full">Produk</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.totalProducts}</div>
              <div className="text-sm text-white/80 font-medium">Total Produk</div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <ShoppingCart className="text-white/80" size={32} />
                <span className="text-xs font-semibold text-white/70 bg-white/20 px-3 py-1 rounded-full">Pesanan</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.totalOrders}</div>
              <div className="text-sm text-white/80 font-medium">Total Pesanan</div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <Users className="text-white/80" size={32} />
                <span className="text-xs font-semibold text-white/70 bg-white/20 px-3 py-1 rounded-full">Pelanggan</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.totalCustomers}</div>
              <div className="text-sm text-white/80 font-medium">Total Pelanggan</div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <DollarSign className="text-white/80" size={32} />
                <span className="text-xs font-semibold text-white/70 bg-white/20 px-3 py-1 rounded-full">Revenue</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stats.totalRevenue}</div>
              <div className="text-sm text-white/80 font-medium">Total Pendapatan</div>
            </div>
          </div>
        </div>

        {/* Two Column Layout - Professional Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8">
          
          {/* Left Column - Orders Section */}
          <div className="xl:col-span-3 space-y-6">
            {/* Recent Orders */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity size={20} />
                  Pesanan Terbaru
                </h2>
              </div>
              <div className="p-6">
                <RecentOrders orders={recentOrders} />
              </div>
            </div>

            {/* Order Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-5 border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-yellow-600 font-semibold text-sm">PENDING</span>
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <ShoppingCart className="text-yellow-600" size={20} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-800">{orderStatusCount.pending}</div>
                <div className="text-sm text-gray-500 mt-1">Menunggu Proses</div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-5 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-600 font-semibold text-sm">SELESAI</span>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <TrendingUp className="text-green-600" size={20} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-800">{orderStatusCount.completed}</div>
                <div className="text-sm text-gray-500 mt-1">Pesanan Selesai</div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-5 border-l-4 border-red-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-600 font-semibold text-sm">DIBATALKAN</span>
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Activity className="text-red-600" size={20} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-800">{orderStatusCount.cancelled}</div>
                <div className="text-sm text-gray-500 mt-1">Pesanan Dibatalkan</div>
              </div>
            </div>
          </div>

          {/* Right Column - Products */}
          <div className="xl:col-span-2">
            {/* Top Products */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full">
              <div className="bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Package size={20} />
                  Produk Terlaris
                </h2>
              </div>
              <div className="p-6">
                <TopProducts products={products.slice(0, 3)} />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State - Inline in content */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-pink-200">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
                <p className="text-gray-700 font-medium">Memuat data dashboard...</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;