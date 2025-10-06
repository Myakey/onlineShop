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
  User
} from "lucide-react";
import NavbarAdmin from "../components/layout/NavbarAdmin";
import orderService from "../services/orderService";

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
    const baseUrl = "http://localhost:8080";
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
      <span className={`${s.bg} ${s.text} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit`}>
        <Icon className="w-3 h-3" /> {status}
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
      <span className={`${c.bg} ${c.text} px-3 py-1 rounded-full text-xs font-semibold`}>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50">
      <NavbarAdmin />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Daftar Order</h2>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "all", label: "Semua", count: orders.length },
              { key: "unpaid", label: "Belum Bayar", count: orders.filter(o => o.payment_status === "unpaid").length },
              { key: "pending_proof", label: "Perlu Verifikasi", count: orders.filter(o => o.payment_status === "unpaid" && o.payment_proof).length },
              { key: "paid", label: "Sudah Bayar", count: orders.filter(o => o.payment_status === "paid").length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === tab.key
                    ? "bg-gradient-to-r from-pink-500 to-cyan-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="grid gap-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Tidak ada pesanan</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div
                key={order.order_id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border-2 border-gray-100"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{order.order_number}</h3>
                      <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {order.user.first_name} {order.user.last_name} ({order.user.email})
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-pink-600">
                        Rp {parseFloat(order.total_amount).toLocaleString("id-ID")}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {order.items.length} item(s)
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mb-4">
                    {getStatusBadge(order.status)}
                    {getPaymentBadge(order.payment_status)}
                    {order.payment_proof && order.payment_status === "unpaid" && (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Ada Bukti Pembayaran
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t pt-4 flex flex-wrap gap-2">
                    {order.payment_proof && (
                      <button
                        onClick={() => viewPaymentProof(order.payment_proof)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" /> Lihat Bukti
                      </button>
                    )}

                    {order.payment_status === "unpaid" && order.payment_proof && (
                      <>
                        <button
                          onClick={() => handleConfirmPayment(order)}
                          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" /> Konfirmasi
                        </button>
                        <button
                          onClick={() => handleRejectPayment(order)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 flex items-center gap-2"
                        >
                          <X className="w-4 h-4" /> Tolak
                        </button>
                      </>
                    )}

                    {order.payment_status === "paid" && (
                      <>
                        {order.status === "processing" && (
                          <button
                            onClick={() => handleUpdateStatus(order, "shipped")}
                            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold hover:bg-purple-200 flex items-center gap-2"
                          >
                            <Truck className="w-4 h-4" /> Kirim Pesanan
                          </button>
                        )}
                        {order.status === "shipped" && (
                          <button
                            onClick={() => handleUpdateStatus(order, "delivered")}
                            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 flex items-center gap-2"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {confirmAction.title}
            </h3>
            <p className="text-gray-600 mb-6">{confirmAction.message}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={executeAction}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-cyan-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Memproses...
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
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={imageUrl}
              alt="Payment Proof"
              className="w-full h-auto rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrder;
