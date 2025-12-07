import React from "react";
import { CreditCard, Split, ShoppingBag } from "lucide-react";

const OrderPaymentChannel = ({
  paymentChannel,
  setPaymentChannel,
  splitAmount,
  setSplitAmount,
  marketplaceLink,
  setMarketplaceLink,
  selectedMarketplace,
  setSelectedMarketplace,
  productTotal,
}) => {
  const paymentChannels = [
    {
      id: "full_transfer",
      name: "Full Transfer",
      icon: <CreditCard className="w-6 h-6" />,
      description: "Bayar penuh via transfer bank BCA + ongkir",
      activeStyles: {
        border: "border-blue-500",
        bg: "bg-blue-50",
        iconBg: "bg-blue-500",
        iconText: "text-white",
      },
      inactiveStyles: {
        iconBg: "bg-gray-100",
        iconText: "text-gray-600",
      },
    },
    {
      id: "split_payment",
      name: "Split Payment",
      icon: <Split className="w-6 h-6" />,
      description: "Sebagian transfer BCA, sebagian via Shopee/TikTok",
      activeStyles: {
        border: "border-purple-500",
        bg: "bg-purple-50",
        iconBg: "bg-purple-500",
        iconText: "text-white",
      },
      inactiveStyles: {
        iconBg: "bg-gray-100",
        iconText: "text-gray-600",
      },
    },
    {
      id: "marketplace",
      name: "Full Marketplace",
      icon: <ShoppingBag className="w-6 h-6" />,
      description: "Checkout langsung via Shopee/TikTok (no ongkir tambahan)",
      activeStyles: {
        border: "border-orange-500",
        bg: "bg-orange-50",
        iconBg: "bg-orange-500",
        iconText: "text-white",
      },
      inactiveStyles: {
        iconBg: "bg-gray-100",
        iconText: "text-gray-600",
      },
    },
  ];

  const handleSplitAmountChange = (type, value) => {
    const numValue = Number(value) || 0;
    
    if (type === "transfer") {
      setSplitAmount({
        transfer: numValue,
        marketplace: Math.max(0, productTotal - numValue),
      });
    } else {
      setSplitAmount({
        transfer: Math.max(0, productTotal - numValue),
        marketplace: numValue,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-pink-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
        <CreditCard className="w-6 h-6 text-pink-500 mr-2" />
        Pilih Metode Pembayaran
      </h2>
      <p className="text-gray-600 mb-6">
        Pilih cara pembayaran yang paling nyaman untuk Anda
      </p>

      {/* Payment Channel Options */}
      <div className="space-y-4 mb-6">
        {paymentChannels.map((channel) => {
          const isActive = paymentChannel === channel.id;
          return (
            <button
              key={channel.id}
              onClick={() => setPaymentChannel(channel.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                isActive
                  ? `${channel.activeStyles.border} ${channel.activeStyles.bg} shadow-md`
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start">
                <div
                  className={`p-3 rounded-lg ${
                    isActive
                      ? `${channel.activeStyles.iconBg} ${channel.activeStyles.iconText}`
                      : `${channel.inactiveStyles.iconBg} ${channel.inactiveStyles.iconText}`
                  }`}
                >
                  {channel.icon}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-bold text-lg text-gray-800">
                    {channel.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {channel.description}
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${
                    isActive
                      ? `${channel.activeStyles.border.replace('border-', 'border-')} ${channel.activeStyles.iconBg}`
                      : "border-gray-300"
                  }`}
                >
                  {isActive && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Payment Details Section */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        {/* Full Transfer Details */}
        {paymentChannel === "full_transfer" && (
          <div>
            <h4 className="font-bold text-gray-800 mb-3">
              Detail Pembayaran Transfer
            </h4>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                Anda akan menerima detail transfer ke rekening BCA setelah order
                dibuat
              </p>
              <div className="flex items-center justify-between py-2 border-t border-gray-200 mt-2">
                <span className="text-gray-700">Total Produk:</span>
                <span className="font-bold text-gray-900">
                  Rp {productTotal.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700">Ongkir:</span>
                <span className="text-gray-600 text-sm">
                  (akan dihitung setelah pilih kurir)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Split Payment Details */}
        {paymentChannel === "split_payment" && (
          <div>
            <h4 className="font-bold text-gray-800 mb-3">
              Atur Pembagian Pembayaran
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Total Produk: Rp {productTotal.toLocaleString("id-ID")}
            </p>

            <div className="space-y-4">
              {/* Transfer Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Transfer BCA
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={splitAmount.transfer}
                    onChange={(e) =>
                      handleSplitAmountChange("transfer", e.target.value)
                    }
                    max={productTotal}
                    min={0}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Marketplace Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah via Marketplace
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={splitAmount.marketplace}
                    onChange={(e) =>
                      handleSplitAmountChange("marketplace", e.target.value)
                    }
                    max={productTotal}
                    min={0}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Marketplace Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform Marketplace
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedMarketplace("shopee")}
                    className={`p-3 rounded-lg border-2 font-medium transition-all ${
                      selectedMarketplace === "shopee"
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    Shopee
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMarketplace("tiktok")}
                    className={`p-3 rounded-lg border-2 font-medium transition-all ${
                      selectedMarketplace === "tiktok"
                        ? "border-black bg-gray-50 text-gray-900"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    TikTok Shop
                  </button>
                </div>
              </div>

              {/* Validation Messages */}
              {splitAmount.transfer + splitAmount.marketplace !== productTotal && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                  ⚠️ Total pembayaran harus sama dengan total produk (Rp{" "}
                  {productTotal.toLocaleString("id-ID")})
                </div>
              )}

              {(splitAmount.transfer <= 0 || splitAmount.marketplace <= 0) && (
                <div className="bg-yellow-50 text-yellow-700 p-3 rounded-lg text-sm">
                  ⚠️ Kedua metode pembayaran harus lebih dari Rp 0
                </div>
              )}

              {splitAmount.transfer + splitAmount.marketplace === productTotal && 
               splitAmount.transfer > 0 && 
               splitAmount.marketplace > 0 && (
                <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
                  ✓ Pembagian pembayaran valid!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Marketplace Full Payment Details */}
        {paymentChannel === "marketplace" && (
          <div>
            <h4 className="font-bold text-gray-800 mb-3">
              Checkout via Marketplace
            </h4>
            
            {/* Platform Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Platform
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMarketplace("shopee")}
                  className={`p-4 rounded-lg border-2 font-medium transition-all ${
                    selectedMarketplace === "shopee"
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  🛒 Shopee
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMarketplace("tiktok")}
                  className={`p-4 rounded-lg border-2 font-medium transition-all ${
                    selectedMarketplace === "tiktok"
                      ? "border-black bg-gray-50 text-gray-900"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  🎵 TikTok Shop
                </button>
              </div>
            </div>

            {/* Link Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link Produk {selectedMarketplace === "shopee" ? "Shopee" : "TikTok Shop"}
              </label>
              <input
                type="url"
                value={marketplaceLink}
                onChange={(e) => setMarketplaceLink(e.target.value)}
                placeholder={`Masukkan link produk dari ${selectedMarketplace === "shopee" ? "Shopee" : "TikTok Shop"}`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Kami akan mengirimkan link produk untuk Anda checkout langsung
                di platform marketplace
              </p>
            </div>

            <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                ✅ Tidak ada biaya ongkir tambahan - sudah termasuk di marketplace
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPaymentChannel;