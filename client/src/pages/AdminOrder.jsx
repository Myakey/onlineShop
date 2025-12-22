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
  Filter,
  Edit,
  Download
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import orderService from "../services/orderService";
import NavbarAdmin from "../components/layout/NavbarAdmin";
import paymentService from "../services/paymentService";

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
  const [showStatusModal, setShowStatusModal] = useState(false);

  const baseUrl = "http://localhost:8080";

  const getPaymentStatus = (order) => {
    return order.payments?.[0]?.payment_status || "unpaid";
  };

  const hasPaymentProof = (order) => {
    return order.payments?.[0]?.payment_proofs?.length > 0;
  };

  const getPaymentProofUrl = (order) => {
    return order.payments?.[0]?.payment_proofs?.[0]?.file_url || null;
  };

  const getTotalAmount = (order) => {
    return parseFloat(order.payments?.[0]?.payment_amount || order.total_amount || 0);
  };

  const getPaymentId = (order) => {
    return order.payments?.[0]?.payment_id || null;
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "unpaid") return getPaymentStatus(order) === "unpaid";
    if (filter === "paid") return getPaymentStatus(order) === "paid";
    if (filter === "pending_proof")
      return getPaymentStatus(order) === "unpaid" && hasPaymentProof(order);
    return true;
  });

  const handleExportReportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Laporan Rekapitulasi Pesanan", 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 30);
    doc.text(`Filter: ${filter.toUpperCase()}`, 14, 36);

    const tableColumn = ["No", "No. Order", "Pelanggan", "Tanggal", "Total", "Status", "Pembayaran"];
    const tableRows = [];

    filteredOrders.forEach((order, index) => {
      const rowData = [
        index + 1,
        order.order_number,
        `${order.user.first_name} ${order.user.last_name}`,
        formatDate(order.created_at),
        `Rp ${getTotalAmount(order).toLocaleString("id-ID")}`,
        order.status,
        getPaymentStatus(order)
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 42,
      theme: 'grid',
      headStyles: { fillColor: [219, 39, 119] }, 
      styles: { fontSize: 8 }
    });

    doc.save("Laporan_Pesanan.pdf");
  };

  const handleDownloadInvoice = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("INVOICE", 14, 20);
    doc.setFontSize(10);
    doc.text(`Order: ${order.order_number}`, 14, 30);
    doc.text(`Customer: ${order.user.first_name}`, 14, 35);
    
    const rows = order.items.map(item => [
      item.product_name, 
      item.quantity, 
      `Rp ${parseFloat(item.price).toLocaleString('id-ID')}`,
      `Rp ${(item.quantity * item.price).toLocaleString('id-ID')}`
    ]);
    
    doc.autoTable({
      head: [["Produk", "Qty", "Harga", "Total"]],
      body: rows,
      startY: 45
    });

    doc.text(`Grand Total: Rp ${getTotalAmount(order).toLocaleString('id-ID')}`, 14, doc.lastAutoTable.finalY + 10);
    doc.save(`Invoice_${order.order_number}.pdf`);
  };

  const handleConfirmPayment = (order) => {
    setSelectedOrder(order);
    setConfirmAction({
      type: "payment",
      status: "paid",
      paymentId: getPaymentId(order),
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
      paymentId: getPaymentId(order),
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

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setShowStatusModal(true);
  };

  const executeAction = async () => {
    try {
      setActionLoading(true);
      if (confirmAction.type === "payment") {
        await paymentService.updatePaymentStatus(confirmAction.paymentId, confirmAction.status);
      } else {
        await orderService.updateOrderStatus(selectedOrder.order_id, confirmAction.status);
      }
      await loadOrders();
      setShowConfirmModal(false);
      setShowStatusModal(false);
      setSelectedOrder(null);
      setConfirmAction(null);
      alert("Pesanan berhasil diperbarui!");
    } catch (error) {
      alert(error.response?.data?.message || "Gagal memperbarui pesanan");
    } finally {
      setActionLoading(false);
    }
  };

  const viewPaymentProof = (url) => {
    if (!url) return;
    const finalUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
    setImageUrl(finalUrl);
    setShowImageModal(true);
  };

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

  const statusOptions = [
    { value: "pending", label: "Pending", icon: Clock, color: "yellow" },
    { value: "confirmed", label: "Confirmed", icon: FileText, color: "blue" },
    { value: "processing", label: "Processing", icon: Package, color: "purple" },
    { value: "shipped", label: "Shipped", icon: Truck, color: "indigo" },
    { value: "delivered", label: "Delivered", icon: CheckCircle, color: "green" },
    { value: "cancelled", label: "Cancelled", icon: XCircle, color: "red" }
  ];

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
    <>
    <NavbarAdmin />
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 p-6">
      
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section dengan Tombol Export seperti AdminProduct */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                Manajemen Pesanan
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <ShoppingCart size={16} />
                Kelola semua pesanan pelanggan
              </p>
            </div>
            
            {/* TOMBOL GLOBAL EXPORT PDF DI SINI */}
            <button
              onClick={handleExportReportPDF}
              className="group relative px-6 py-3 bg-pink-500 text-white rounded-xl font-medium overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-2">
                <Download size={20} className="group-hover:translate-y-1 transition-transform duration-300" />
                Export Laporan PDF
              </div>
            </button>
          </div>
        </div>

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
                  {orders.filter(o => getPaymentStatus(o) === "unpaid" && hasPaymentProof(o)).length}
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
                  {orders.filter(o => getPaymentStatus(o) === "paid").length}
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
                  Rp {orders.filter(o => getPaymentStatus(o) === "paid")
                    .reduce((sum, o) => sum + getTotalAmount(o), 0)
                    .toLocaleString("id-ID")}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

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
                {tab.label}
              </button>
            ))}
          </div>
        </div>

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
                        Rp {getTotalAmount(order).toLocaleString("id-ID")}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.items.length} item(s)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
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

                  <div className="mb-4 space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                        <div className="w-12 h-12 flex-shrink-0 bg-white rounded-md border border-gray-200 overflow-hidden">
                          {item.product_image ? (
                             <img
                               src={item.product_image.startsWith("http") ? item.product_image : `${baseUrl}${item.product_image}`}
                               alt={item.product_name}
                               className="w-full h-full object-cover"
                               onError={(e) => {e.target.style.display='none'}}
                             />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                               <Package size={20} />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{item.product_name}</p>
                          <p className="text-xs text-gray-500">
                            {item.quantity} x Rp {parseFloat(item.price).toLocaleString("id-ID")}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-gray-700 whitespace-nowrap">
                          Rp {(item.quantity * item.price).toLocaleString("id-ID")}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 mb-4 flex-wrap items-center">
                    {getStatusBadge(order.status)}
                    {getPaymentBadge(getPaymentStatus(order))}
                    
                    {hasPaymentProof(order) && getPaymentStatus(order) === "unpaid" && (
                      <span className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-blue-200 cursor-default">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Ada Bukti Pembayaran
                      </span>
                    )}

                    {hasPaymentProof(order) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          viewPaymentProof(getPaymentProofUrl(order));
                        }}
                        className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-200 bg-white text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm"
                        title="Lihat Bukti Pembayaran"
                      >
                        <Eye className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                        Lihat Bukti
                      </button>
                    )}
                  </div>

                  <div className="border-t-2 border-gray-100 pt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => openStatusModal(order)}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" /> Ubah Status
                    </button>

                    {/* Tombol Invoice Per Item */}
                    <button
                      onClick={() => handleDownloadInvoice(order)}
                      className="px-5 py-2.5 bg-gradient-to-r from-gray-600 to-slate-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Invoice
                    </button>

                    {getPaymentProofUrl(order) && (
                      <button
                        onClick={() => viewPaymentProof(getPaymentProofUrl(order))}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" /> Lihat Bukti
                      </button>
                    )}

                    {getPaymentStatus(order) === "unpaid" && hasPaymentProof(order) && (
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
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-3 rounded-full">
                <Edit className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Ubah Status Pesanan
                </h3>
                <p className="text-sm text-gray-600">{selectedOrder.order_number}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {statusOptions.map((option) => {
                const Icon = option.icon;
                const isCurrentStatus = selectedOrder.status === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleUpdateStatus(selectedOrder, option.value)}
                    disabled={isCurrentStatus}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                      isCurrentStatus
                        ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60'
                        : `border-${option.color}-200 hover:border-${option.color}-400 hover:bg-${option.color}-50 hover:shadow-md transform hover:scale-102`
                    }`}
                  >
                    <div className={`p-2 rounded-lg bg-${option.color}-100`}>
                      <Icon className={`w-5 h-5 text-${option.color}-600`} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-800">{option.label}</p>
                      {isCurrentStatus && (
                        <p className="text-xs text-gray-500">Status saat ini</p>
                      )}
                    </div>
                    {isCurrentStatus && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowStatusModal(false)}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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

      {showImageModal && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
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
    </div>
    </>
  );
};

export default AdminOrder;