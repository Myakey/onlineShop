import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Truck,
  AlertCircle,
  Loader2,
  FileText,
  X,
  Check,
  Eye,
  User,
  ShoppingCart,
  DollarSign,
  Filter
} from "lucide-react";
import NavbarAdmin from "../components/layout/NavbarAdmin";
import orderService from "../services/orderService";
import Footer from "../components/layout/Footer";

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      console.error("Error loading orders:", error);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = (order) => {
    setSelectedOrder(order);
    setConfirmAction({
      type: "payment",
      status: "paid",
      title: "Konfirmasi Pembayaran",
      message: `Apakah Anda yakin ingin mengonfirmasi pembayaran untuk pesanan ${order.order_number}?`
    });
    setShowConfirmModal(true);
  };

  const handleRejectPayment = (order) => {
    setSelectedOrder(order);
    setConfirmAction({
      type: "payment",
      status: "failed",
      title: "Tolak Pembayaran",
      message: `Apakah Anda yakin ingin menolak pembayaran untuk pesanan ${order.order_number}?`
    });
    setShowConfirmModal(true);
  };

  const handleUpdateStatus = (order, newStatus) => {
    setSelectedOrder(order);
    setConfirmAction({
      type: "status",
      status: newStatus,
      title: "Perbarui Status Pesanan",
      message: `Ubah status pesanan ${order.order_number} menjadi "${newStatus}"?`
    });
    setShowConfirmModal(true);
  };

  const executeAction = async () => {
    try {
      setActionLoading(true);
      if (confirmAction.type === "payment") {
        await orderService.updatePaymentStatus(selectedOrder.order_id, confirmAction.status);
      } else {
        await orderService.updateOrderStatus(selectedOrder.order_id, confirmAction.status);
      }
      await loadOrders();
      setShowConfirmModal(false);
      setSelectedOrder(null);
      setConfirmAction(null);
      alert("Pesanan berhasil diperbarui!");
    } catch (error) {
      console.error("Error executing action:", error);
      alert(error.response?.data?.message || "Gagal memperbarui pesanan");
    } finally {
      setActionLoading(false);
    }
  };

  const viewPaymentProof = (url) => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
    setImageUrl(url.startsWith("http") ? url : `${baseUrl}${url}`);
    setShowImageModal(true);
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "unpaid") return order.payment_status === "unpaid";
    if (filter === "paid") return order.payment_status === "paid";
    if (filter === "pending_proof")
      return order.payment_status === "unpaid" && order.payment_proof;
    return true;
  });

  const getStatusBadge = (status) => {
    const config = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
      confirmed: { bg: "bg-blue-100", text: "text-blue-700", icon: FileText },
      processing: { bg: "bg-purple-100", text: "text-purple-700", icon: Package },
      shipped: { bg: "bg-indigo-100", text: "text-indigo-700", icon: Truck },
      delivered: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
      cancelled: { bg: "bg-red-100", text: "text-red-700", icon: XCircle }
    };

    const s = config[status] || config.pending;
    const Icon = s.icon;
    return (
      <span className={`${s.bg} ${s.text} px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 w-fit`}>
        <Icon className="w-3.5 h-3.5" /> {status}
      </span>
    );
  };

  const getPaymentBadge = (payment_status) => {
    const config = {
      unpaid: { bg: "bg-red-100", text: "text-red-700" },
      paid: { bg: "bg-green-100", text: "text-green-700" },
      failed: { bg: "bg-gray-100", text: "text-gray-700" },
      refunded: { bg: "bg-orange-100", text: "text-orange-700" }
    };
    const c = config[payment_status] || config.unpaid;
    return (
      <span className={`${c.bg} ${c.text} px-3 py-1.5 rounded-full text-xs font-semibold`}>
        {payment_status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-pink-200">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-16 h-16 text-pink-600 animate-spin" />
            <p className="text-gray-700 font-medium">Memuat data pesanan...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50">
      <NavbarAdmin />
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Manajemen Pesanan
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <ShoppingCart size={16} />
            Kelola semua pesanan pelanggan
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-5 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Pesanan</p>
                <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingCart className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-5 border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Perlu Verifikasi</p>
                <p className="text-3xl font-bold text-gray-800">
                  {orders.filter(o => o.payment_status === "unpaid" && o.payment_proof).length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <AlertCircle className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-5 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Sudah Bayar</p>
                <p className="text-3xl font-bold text-gray-800">
                  {orders.filter(o => o.payment_status === "paid").length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-5 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">
                  Rp {orders.filter(o => o.payment_status === "paid")
                    .reduce((sum, o) => sum + parseFloat(o.total_amount), 0)
                    .toLocaleString("id-ID")}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="text-purple-600" size={20} />
            <h3 className="text-lg font-bold text-gray-800">Filter Pesanan</h3>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { key: "all", label: "Semua",  color: "from-purple-500 to-blue-500" },
              { key: "unpaid", label: "Belum Bayar", color: "from-red-500 to-pink-500" },
              { key: "pending_proof", label: "Perlu Verifikasi", color: "from-yellow-500 to-orange-500" },
              { key: "paid", label: "Sudah Bayar", color: "from-green-500 to-emerald-500" }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  filter === tab.key
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label} <span className="font-bold"></span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="grid gap-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-gray-100">
              <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-xl font-semibold">Tidak ada pesanan</p>
              <p className="text-gray-400 text-sm mt-2">Belum ada pesanan yang sesuai dengan filter</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div
                key={order.order_id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Order Header with Gradient */}
                <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-cyan-100 px-6 py-4 border-b-2 border-gray-200">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="text-purple-600" size={20} />
                        {order.order_number}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                        <Clock size={14} />
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        Rp {parseFloat(order.total_amount).toLocaleString("id-ID")}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.items.length} item(s)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  {/* Customer Info */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4 border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-lg">
                        <User className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Pelanggan</p>
                        <p className="text-gray-800 font-semibold">
                          {order.user.first_name} {order.user.last_name}
                        </p>
                        <p className="text-sm text-gray-600">{order.user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex gap-3 mb-4 flex-wrap">
                    {getStatusBadge(order.status)}
                    {getPaymentBadge(order.payment_status)}
                    {order.payment_proof && order.payment_status === "unpaid" && (
                      <span className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-blue-200">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Ada Bukti Pembayaran
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t-2 border-gray-100 pt-4 flex flex-wrap gap-3">
                    {order.payment_proof && (
                      <button
                        onClick={() => viewPaymentProof(order.payment_proof)}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" /> Lihat Bukti
                      </button>
                    )}

                    {order.payment_status === "unpaid" && order.payment_proof && (
                      <>
                        <button
                          onClick={() => handleConfirmPayment(order)}
                          className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" /> Konfirmasi Pembayaran
                        </button>
                        <button
                          onClick={() => handleRejectPayment(order)}
                          className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                        >
                          <X className="w-4 h-4" /> Tolak Pembayaran
                        </button>
                      </>
                    )}

                    {order.payment_status === "paid" && (
                      <>
                        {order.status === "processing" && (
                          <button
                            onClick={() => handleUpdateStatus(order, "shipped")}
                            className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                          >
                            <Truck className="w-4 h-4" /> Kirim Pesanan
                          </button>
                        )}
                        {order.status === "shipped" && (
                          <button
                            onClick={() => handleUpdateStatus(order, "delivered")}
                            className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" /> Tandai Diterima
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-full">
                <AlertCircle className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                {confirmAction.title}
              </h3>
            </div>
            <p className="text-gray-600 mb-6 text-lg">{confirmAction.message}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={actionLoading}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 disabled:opacity-50 transition-all"
              >
                Batal
              </button>
              <button
                onClick={executeAction}
                disabled={actionLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Memproses...
                  </>
                ) : (
                  "Konfirmasi"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-14 right-0 bg-white text-gray-800 hover:bg-gray-100 p-2 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="bg-white p-4 rounded-2xl shadow-2xl">
              <img
                src={imageUrl}
                alt="Payment Proof"
                className="w-full h-auto rounded-xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default AdminOrder;