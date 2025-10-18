import React, { useState, useEffect } from "react";
import { 
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  FileText,
  Loader2,
  AlertCircle,
  CreditCard,
  Eye,
  Star
} from "lucide-react";
import orderService from "../../services/orderService";
import Navbar from "../../components/layout/Navbar";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error("Error loading orders:", error);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock, label: "Pending" },
      confirmed: { bg: "bg-blue-100", text: "text-blue-700", icon: FileText, label: "Confirmed" },
      processing: { bg: "bg-purple-100", text: "text-purple-700", icon: Package, label: "Processing" },
      shipped: { bg: "bg-indigo-100", text: "text-indigo-700", icon: Truck, label: "Shipped" },
      delivered: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle, label: "Delivered" },
      cancelled: { bg: "bg-red-100", text: "text-red-700", icon: XCircle, label: "Cancelled" }
    };
    return configs[status] || configs.pending;
  };

  const getPaymentStatusConfig = (paymentStatus) => {
    const configs = {
      unpaid: { bg: "bg-red-100", text: "text-red-700", label: "Unpaid" },
      paid: { bg: "bg-green-100", text: "text-green-700", label: "Paid" },
      failed: { bg: "bg-gray-100", text: "text-gray-700", label: "Failed" },
      refunded: { bg: "bg-orange-100", text: "text-orange-700", label: "Refunded" }
    };
    return configs[paymentStatus] || configs.unpaid;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (orderId) => {
    window.location.href = `/orders/${orderId}`;
  };

  const handlePayNow = (orderId) => {
    window.location.href = `/payment/${orderId}`;
  };

  const handleWriteReview = (orderId) => {
    window.location.href = `/orders/${orderId}/review`;
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      await orderService.cancelOrder(orderId);
      alert("Order cancelled successfully");
      loadOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true;
    if (filter === "pending") return order.status === "pending" || order.status === "confirmed";
    if (filter === "shipping") return order.status === "processing" || order.status === "shipped";
    if (filter === "completed") return order.status === "delivered";
    if (filter === "cancelled") return order.status === "cancelled";
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-pink-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Package className="w-10 h-10 text-pink-500" />
            My Orders
          </h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "all", label: "All", count: orders.length },
              { key: "pending", label: "Pending", count: orders.filter(o => o.status === "pending" || o.status === "confirmed").length },
              { key: "shipping", label: "Shipping", count: orders.filter(o => o.status === "processing" || o.status === "shipped").length },
              { key: "completed", label: "Completed", count: orders.filter(o => o.status === "delivered").length },
              { key: "cancelled", label: "Cancelled", count: orders.filter(o => o.status === "cancelled").length }
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

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-md p-12 text-center">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Orders Found</h3>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet</p>
            <button
              onClick={() => window.location.href = "/products"}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-cyan-600"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => {
              const statusConfig = getStatusConfig(order.status);
              const paymentConfig = getPaymentStatusConfig(order.payment_status);
              const StatusIcon = statusConfig.icon;

              return (
                <div 
                  key={order.order_id} 
                  className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all border-2 border-pink-100 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-pink-50 to-cyan-50 p-4 border-b-2 border-pink-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Order Number</p>
                        <p className="font-bold text-gray-800">{order.order_number}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Order Date</p>
                        <p className="font-semibold text-gray-800 text-sm">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`${statusConfig.bg} ${statusConfig.text} px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig.label}
                      </span>
                      <span className={`${paymentConfig.bg} ${paymentConfig.text} px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2`}>
                        <CreditCard className="w-4 h-4" />
                        {paymentConfig.label}
                      </span>
                    </div>

                    {order.payment_status === "unpaid" && !order.payment_proof && (
                      <div className="mb-4 p-3 bg-yellow-50 border-2 border-yellow-200 rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <span className="text-sm text-yellow-700 font-semibold">
                          Payment proof required
                        </span>
                      </div>
                    )}

                    {/* ✅ Show review reminder for delivered orders */}
                    {order.status === "delivered" && (
                      <div className="mb-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-600" />
                        <span className="text-sm text-yellow-700 font-semibold">
                          Share your experience! Write a review for this order
                        </span>
                      </div>
                    )}

                    <div className="mb-4">
                      <div className="grid grid-cols-1 gap-3">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                            <img 
                              src={item.product.image_url ? `${item.product.image_url}` : '/api/placeholder/60/60'} 
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">{item.product.name}</p>
                              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-pink-600">
                                Rp {parseFloat(item.subtotal).toLocaleString('id-ID')}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-gray-500 text-center">
                            +{order.items.length - 2} more items
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4 p-4 bg-gradient-to-r from-pink-50 to-cyan-50 rounded-xl border-2 border-pink-200">
                      <span className="font-bold text-gray-800">Total Amount</span>
                      <span className="text-2xl font-bold text-pink-600">
                        Rp {parseFloat(order.total_amount).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleViewDetails(order.order_id)}
                        className="flex-1 min-w-fit px-4 py-3 bg-gradient-to-r from-pink-100 to-cyan-100 text-gray-800 rounded-xl font-semibold hover:from-pink-200 hover:to-cyan-200 transition-all flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>

                      {/* ✅ Show Write Review button for delivered orders */}
                      {order.status === "delivered" && (
                        <button
                          onClick={() => handleWriteReview(order.order_id)}
                          className="flex-1 min-w-fit px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl font-semibold hover:from-yellow-500 hover:to-orange-500 transition-all flex items-center justify-center gap-2 shadow-md"
                        >
                          <Star className="w-4 h-4" />
                          Write Review
                        </button>
                      )}

                      {order.payment_status === "unpaid" && !order.payment_proof && (
                        <button
                          onClick={() => handlePayNow(order.secure_token)}
                          className="flex-1 min-w-fit px-4 py-3 bg-gradient-to-r from-pink-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          Upload Payment
                        </button>
                      )}

                      {(order.status === "pending" || order.status === "confirmed") && order.payment_status === "unpaid" && (
                        <button
                          onClick={() => handleCancelOrder(order.order_id)}
                          className="px-4 py-3 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition-all flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default MyOrders;