import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, XCircle, Clock, MapPin, CreditCard, FileText, Tag, AlertCircle, Loader } from 'lucide-react';
import { getOrderByToken } from '../../services/orderService';
import { useParams } from 'react-router';
import Navbar from '../../components/layout/Navbar';

// Mock data for demo purposes - remove this when using real API
const useMockData = false;
const getMockOrder = () => {
  return {
    success: true,
    data: {
          order_id: 12345,
          order_number: "ORD-1733745234567-123",
          secure_token: token,
          status: "processing",
          created_at: "2024-12-08T10:30:00Z",
          updated_at: "2024-12-08T14:20:00Z",
          payment_due_at: "2024-12-10T23:59:59Z",
          notes: "Please deliver before 5 PM",
          
          user: {
            username: "johndoe",
            email: "john@example.com",
            first_name: "John",
            last_name: "Doe",
            phone_number: "+62812345678"
          },
          
          address: {
            recipient_name: "John Doe",
            phone_number: "+62812345678",
            street_address: "Jl. Sudirman No. 123",
            district: "Kebayoran Baru",
            city: "Jakarta Selatan",
            province: "DKI Jakarta",
            postal_code: "12190",
            notes: "Gedung biru, lantai 5"
          },
          
          shipping_method: {
            name: "Express Delivery",
            courier: "JNE",
            base_cost: 25000,
            estimated_days: 2
          },
          
          promocode: {
            code: "DISCOUNT10",
            discount_type: "percentage",
            discount_value: 10
          },
          
          items: [
            {
              product: {
                product_id: 1,
                name: "Wireless Headphones",
                image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200",
                price: 299000
              },
              quantity: 2,
              price: 299000,
              subtotal: 598000
            },
            {
              product: {
                product_id: 2,
                name: "Smart Watch",
                image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200",
                price: 1500000
              },
              quantity: 1,
              price: 1500000,
              subtotal: 1500000
            }
          ],
          
          payments: [
            {
              payment_id: 1,
              payment_status: "paid",
              payment_amount: 1913100,
              payment_type: "bank_transfer",
              paid_at: "2024-12-08T12:00:00Z",
              payment_methods: [
                {
                  method_name: "Bank Transfer",
                  payment_channel: "BCA",
                  bank_account_name: "PT Toko Online",
                  bank_account_number: "1234567890"
                }
              ],
              payment_proofs: [
                {
                  file_url: "https://example.com/proof.jpg",
                  uploaded_at: "2024-12-08T11:55:00Z"
                }
              ]
            }
          ],
          
          shipments: [
            {
              shipment_id: 1,
              tracking_number: "JNE123456789",
              courier: "JNE",
              shipped_at: "2024-12-08T15:00:00Z",
              status: "in_transit"
            }
          ],
          
          invoices: [
            {
              invoice_id: 1,
              invoice_number: "INV-2024-12-001",
              issued_at: "2024-12-08T10:30:00Z",
              subtotal: 2098000,
              shipping_cost: 25000,
              discount_amount: 209800,
              tax_amount: 0,
              grand_total: 1913200,
              amount_paid: 1913200,
              balance_due: 0,
              status: "paid"
            }
          ]
        }
      };
    };

const OrderDetailsPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get secure token from URL params
  // In real app: const { secureToken } = useParams();
  const { secureToken } = useParams();

  useEffect(() => {
    fetchOrderDetails();
  }, [secureToken]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the real API
      let response;
      if (useMockData) {
        // For demo only
        response = await new Promise((resolve) => {
          setTimeout(() => resolve(getMockOrder()), 1000);
        });
      } else {
        // Real API call
        response = await getOrderByToken(secureToken);
      }
      
      setOrder(response.data || response);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: Clock,
        label: 'Pending',
        description: 'Waiting for payment confirmation'
      },
      confirmed: {
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: CheckCircle,
        label: 'Confirmed',
        description: 'Payment confirmed, preparing your order'
      },
      processing: {
        color: 'bg-purple-100 text-purple-800 border-purple-300',
        icon: Package,
        label: 'Processing',
        description: 'Your order is being prepared'
      },
      shipped: {
        color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
        icon: Truck,
        label: 'Shipped',
        description: 'Your order is on the way'
      },
      delivered: {
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: CheckCircle,
        label: 'Delivered',
        description: 'Order has been delivered'
      },
      cancelled: {
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: XCircle,
        label: 'Cancelled',
        description: 'This order has been cancelled'
      }
    };
    return configs[status] || configs.pending;
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      unpaid: 'bg-red-100 text-red-800',
      paid: 'bg-green-100 text-green-800',
      refunded: 'bg-gray-100 text-gray-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchOrderDetails}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const latestPayment = order.payments?.[0];
  const latestShipment = order.shipments?.[0];
  const latestInvoice = order.invoices?.[0];

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Order #{order.order_number}
              </h1>
              <p className="text-sm text-gray-500">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>
            
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${statusConfig.color}`}>
              <StatusIcon className="w-5 h-5" />
              <div>
                <p className="font-semibold">{statusConfig.label}</p>
                <p className="text-xs">{statusConfig.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Order Timeline
              </h2>
              
              <div className="space-y-4">
                <TimelineItem 
                  status="completed"
                  title="Order Placed"
                  date={formatDate(order.created_at)}
                  active={true}
                />
                
                <TimelineItem 
                  status={latestPayment?.payment_status === 'paid' ? 'completed' : 'pending'}
                  title="Payment Confirmed"
                  date={latestPayment?.paid_at ? formatDate(latestPayment.paid_at) : null}
                  active={order.status !== 'pending'}
                />
                
                <TimelineItem 
                  status={order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'completed' : 'pending'}
                  title="Order Processing"
                  date={order.status === 'processing' ? formatDate(order.updated_at) : null}
                  active={order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered'}
                />
                
                <TimelineItem 
                  status={order.status === 'shipped' || order.status === 'delivered' ? 'completed' : 'pending'}
                  title="Order Shipped"
                  date={latestShipment?.shipped_at ? formatDate(latestShipment.shipped_at) : null}
                  active={order.status === 'shipped' || order.status === 'delivered'}
                />
                
                <TimelineItem 
                  status={order.status === 'delivered' ? 'completed' : 'pending'}
                  title="Order Delivered"
                  date={latestShipment?.delivered_at ? formatDate(latestShipment.delivered_at) : null}
                  active={order.status === 'delivered'}
                />
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Items
              </h2>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <img 
                      src={item.product.image_url || 'https://via.placeholder.com/100'} 
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-500">Price: {formatCurrency(item.price)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(item.subtotal)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information */}
            {latestShipment && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Shipping Information
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Courier</span>
                    <span className="font-semibold">{latestShipment.courier}</span>
                  </div>
                  
                  {latestShipment.tracking_number && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tracking Number</span>
                      <span className="font-semibold font-mono">{latestShipment.tracking_number}</span>
                    </div>
                  )}
                  
                  {latestShipment.status && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className="font-semibold capitalize">{latestShipment.status.replace('_', ' ')}</span>
                    </div>
                  )}
                  
                  {latestShipment.shipped_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipped At</span>
                      <span className="font-semibold">{formatDate(latestShipment.shipped_at)}</span>
                    </div>
                  )}
                  
                  {latestShipment.delivered_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivered At</span>
                      <span className="font-semibold">{formatDate(latestShipment.delivered_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment Information */}
            {latestPayment && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(latestPayment.payment_status)}`}>
                      {latestPayment.payment_status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Amount</span>
                    <span className="font-semibold">{formatCurrency(latestPayment.payment_amount)}</span>
                  </div>
                  
                  {latestPayment.payment_type && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Type</span>
                      <span className="font-semibold capitalize">{latestPayment.payment_type.replace('_', ' ')}</span>
                    </div>
                  )}
                  
                  {latestPayment.payment_methods?.[0] && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method</span>
                        <span className="font-semibold">{latestPayment.payment_methods[0].method_name}</span>
                      </div>
                      
                      {latestPayment.payment_methods[0].payment_channel && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bank/Channel</span>
                          <span className="font-semibold">{latestPayment.payment_methods[0].payment_channel}</span>
                        </div>
                      )}
                      
                      {latestPayment.payment_methods[0].bank_account_number && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Number</span>
                          <span className="font-semibold font-mono">{latestPayment.payment_methods[0].bank_account_number}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  {latestPayment.paid_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid At</span>
                      <span className="font-semibold">{formatDate(latestPayment.paid_at)}</span>
                    </div>
                  )}
                  
                  {latestPayment.payment_proofs?.[0] && (
                    <div className="pt-3 border-t">
                      <p className="text-sm text-gray-600 mb-2">Payment Proof</p>
                      <a 
                        href={latestPayment.payment_proofs[0].file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                      >
                        View Payment Proof
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Order Summary
              </h2>
              
              {latestInvoice ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(latestInvoice.subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping Cost</span>
                    <span className="font-medium">{formatCurrency(latestInvoice.shipping_cost)}</span>
                  </div>
                  
                  {latestInvoice.discount_amount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">-{formatCurrency(latestInvoice.discount_amount)}</span>
                    </div>
                  )}
                  
                  {latestInvoice.tax_amount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">{formatCurrency(latestInvoice.tax_amount)}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">Grand Total</span>
                    <span className="font-bold text-xl text-gray-900">{formatCurrency(latestInvoice.grand_total)}</span>
                  </div>
                  
                  {latestInvoice.amount_paid > 0 && (
                    <>
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Amount Paid</span>
                        <span className="font-medium">{formatCurrency(latestInvoice.amount_paid)}</span>
                      </div>
                      
                      {latestInvoice.balance_due > 0 && (
                        <div className="flex justify-between text-sm text-red-600">
                          <span className="font-semibold">Balance Due</span>
                          <span className="font-semibold">{formatCurrency(latestInvoice.balance_due)}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  {latestInvoice.invoice_number && (
                    <div className="pt-3 border-t">
                      <p className="text-xs text-gray-500">Invoice: {latestInvoice.invoice_number}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(order.items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0))}
                    </span>
                  </div>
                  
                  {order.shipping_method && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">{formatCurrency(order.shipping_method.base_cost)}</span>
                    </div>
                  )}
                  
                  {order.promocode && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({order.promocode.code})</span>
                      <span className="font-medium">
                        -{order.promocode.discount_type === 'percentage' 
                          ? `${order.promocode.discount_value}%` 
                          : formatCurrency(order.promocode.discount_value)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Shipping Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </h2>
              
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-gray-900">{order.address.recipient_name}</p>
                <p className="text-gray-600">{order.address.phone_number}</p>
                <p className="text-gray-600">{order.address.street_address}</p>
                <p className="text-gray-600">
                  {order.address.district}, {order.address.city}
                </p>
                <p className="text-gray-600">
                  {order.address.province} {order.address.postal_code}
                </p>
                {order.address.notes && (
                  <p className="text-gray-500 italic mt-2">Note: {order.address.notes}</p>
                )}
              </div>
            </div>

            {/* Shipping Method */}
            {order.shipping_method && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Shipping Method
                </h2>
                
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-gray-900">{order.shipping_method.name}</p>
                  <p className="text-gray-600">Courier: {order.shipping_method.courier}</p>
                  <p className="text-gray-600">Cost: {formatCurrency(order.shipping_method.base_cost)}</p>
                  <p className="text-gray-600">Estimated: {order.shipping_method.estimated_days} days</p>
                </div>
              </div>
            )}

            {/* Promo Code */}
            {order.promocode && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Promo Code Applied
                </h2>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="font-bold text-green-800 text-lg">{order.promocode.code}</p>
                  {order.promocode.description && (
                    <p className="text-sm text-green-700 mt-1">{order.promocode.description}</p>
                  )}
                  <p className="text-sm text-green-600 mt-2">
                    Discount: {order.promocode.discount_type === 'percentage' 
                      ? `${order.promocode.discount_value}%` 
                      : formatCurrency(order.promocode.discount_value)}
                  </p>
                </div>
              </div>
            )}

            {/* Customer Notes */}
            {order.notes && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Notes</h2>
                <p className="text-sm text-gray-600 italic">{order.notes}</p>
              </div>
            )}

            {/* Action Buttons */}
            {order.status === 'pending' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
                
                <div className="space-y-3">
                  {order.payment_due_at && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                      <p className="text-xs text-yellow-800">
                        Payment due by: {formatDate(order.payment_due_at)}
                      </p>
                    </div>
                  )}
                  {latestPayment.payment_proofs?.[0] ? <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition">
                    Waiting for confirmation
                  </button> :
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition">
                    Upload Payment Proof
                  </button> 
                }
                 
                  
                  <button className="w-full bg-red-100 text-red-700 py-3 rounded-lg hover:bg-red-200 font-semibold transition">
                    Cancel Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

// Timeline Item Component
const TimelineItem = ({ status, title, date, active }) => {
  const getStatusIcon = () => {
    if (status === 'completed') {
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    } else if (status === 'pending') {
      return <Clock className="w-6 h-6 text-gray-400" />;
    }
    return <Clock className="w-6 h-6 text-gray-400" />;
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        {getStatusIcon()}
        <div className={`w-0.5 h-12 ${status === 'completed' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
      </div>
      
      <div className="flex-1 pb-8">
        <h3 className={`font-semibold ${active ? 'text-gray-900' : 'text-gray-500'}`}>
          {title}
        </h3>
        {date && (
          <p className="text-sm text-gray-500">{date}</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;