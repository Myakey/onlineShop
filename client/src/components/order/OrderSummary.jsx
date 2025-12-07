import React from "react";
import { ShoppingCart, Truck, Tag, Wallet } from "lucide-react";

const OrderSummary = ({ 
  products, 
  selectedShipping, 
  voucher, 
  makeOrder,
  paymentChannel = "full_transfer" 
}) => {
  // Calculate subtotal
  const subtotal = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  // Shipping cost (0 for marketplace)
  const shippingCost = paymentChannel === "marketplace" ? 0 : (selectedShipping?.price || 0);

  // Voucher discount
  const discount = voucher ? 5000 : 0;

  // Calculate total
  const total = subtotal + shippingCost - discount;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-pink-100 sticky top-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Wallet className="w-6 h-6 text-pink-500 mr-2" />
        Ringkasan Pesanan
      </h2>

      {/* Payment Method Info */}
      <div className="mb-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
        <p className="text-sm font-medium text-gray-700 mb-1">Metode Pembayaran:</p>
        <p className="text-lg font-bold text-pink-600">
          {paymentChannel === "full_transfer" && "Full Transfer BCA"}
          {paymentChannel === "split_payment" && "Split Payment (BCA + Marketplace)"}
          {paymentChannel === "marketplace" && "Full Marketplace"}
        </p>
      </div>

      {/* Order Items */}
      <div className="space-y-3 mb-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between py-3 border-b border-gray-100"
          >
            <div className="flex items-center space-x-3 flex-1">
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 text-sm line-clamp-1">
                  {product.name}
                </h4>
                <p className="text-xs text-gray-500">x{product.quantity}</p>
              </div>
            </div>
            <p className="font-semibold text-gray-800 text-sm ml-2">
              Rp {(product.price * product.quantity).toLocaleString("id-ID")}
            </p>
          </div>
        ))}
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-3 mb-6 pt-4 border-t-2 border-gray-200">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <div className="flex items-center text-gray-600">
            <ShoppingCart className="w-4 h-4 mr-2" />
            <span>Subtotal ({products.length} item)</span>
          </div>
          <span className="font-semibold text-gray-800">
            Rp {subtotal.toLocaleString("id-ID")}
          </span>
        </div>

        {/* Shipping Cost */}
        {paymentChannel !== "marketplace" ? (
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-600">
              <Truck className="w-4 h-4 mr-2" />
              <span>Ongkir</span>
            </div>
            <span className="font-semibold text-gray-800">
              Rp {shippingCost.toLocaleString("id-ID")}
            </span>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-600">
              <Truck className="w-4 h-4 mr-2" />
              <span>Ongkir</span>
            </div>
            <span className="font-semibold text-green-600">
              Gratis (via Marketplace)
            </span>
          </div>
        )}

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between items-center">
            <div className="flex items-center text-green-600">
              <Tag className="w-4 h-4 mr-2" />
              <span>Diskon Voucher</span>
            </div>
            <span className="font-semibold text-green-600">
              -Rp {discount.toLocaleString("id-ID")}
            </span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-800">Total Pembayaran</span>
          <span className="text-2xl font-bold text-pink-600">
            Rp {total.toLocaleString("id-ID")}
          </span>
        </div>
        
        {/* Payment Channel Specific Info */}
        {paymentChannel === "split_payment" && (
          <div className="mt-3 pt-3 border-t border-pink-200 space-y-2">
            <p className="text-xs text-gray-600">Pembagian pembayaran akan dikonfirmasi setelah order dibuat</p>
          </div>
        )}
        
        {paymentChannel === "marketplace" && (
          <div className="mt-3 pt-3 border-t border-pink-200">
            <p className="text-xs text-gray-600">
              ✓ Tidak ada biaya tambahan
              <br />
              ✓ Ongkir sudah termasuk di marketplace
            </p>
          </div>
        )}
      </div>

      {/* Place Order Button */}
      <button
        onClick={makeOrder}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
      >
        {paymentChannel === "marketplace" ? "Lanjut ke Checkout" : "Buat Pesanan"}
      </button>

      {/* Additional Info */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800 leading-relaxed">
          {paymentChannel === "full_transfer" && (
            <>
              💳 Setelah order dibuat, Anda akan mendapat detail transfer BCA dan dapat mengupload bukti pembayaran
            </>
          )}
          {paymentChannel === "split_payment" && (
            <>
              🔄 Anda akan melakukan pembayaran sebagian via transfer BCA dan sebagian via marketplace
            </>
          )}
          {paymentChannel === "marketplace" && (
            <>
              🛍️ Order akan diproses setelah Anda menyelesaikan checkout di marketplace
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;