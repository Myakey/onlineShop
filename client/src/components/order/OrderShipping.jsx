import { Truck } from "lucide-react";

const OrderShipping = ({ shippingOptions, selectedShipping, setSelectedShipping, isLoading }) => {
  if (isLoading) {
    return (
      <section className="bg-white rounded-3xl shadow-md p-6 border-2 border-pink-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Truck className="w-6 h-6 text-pink-500" />
          Opsi Pengiriman
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <p className="ml-3 text-gray-600">Menghitung ongkos kirim...</p>
        </div>
      </section>
    );
  }

  if (!shippingOptions || shippingOptions.length === 0) {
    return (
      <section className="bg-white rounded-3xl shadow-md p-6 border-2 border-pink-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Truck className="w-6 h-6 text-pink-500" />
          Opsi Pengiriman
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-600">Tidak ada opsi pengiriman tersedia</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-3xl shadow-md p-6 border-2 border-pink-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Truck className="w-6 h-6 text-pink-500" />
        Opsi Pengiriman
      </h2>
      <div className="space-y-3">
        {shippingOptions.map(opt => (
          <label 
            key={opt.id} 
            className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              selectedShipping?.id === opt.id
                ? 'border-cyan-400 bg-gradient-to-r from-pink-50 to-cyan-50 shadow-md'
                : 'border-gray-200 hover:border-pink-300 bg-white'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-gray-800">{opt.name}</p>
                {opt.type && (
                  <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 text-xs rounded-full font-semibold">
                    {opt.type.toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm">
                {opt.description || opt.duration}
              </p>
              {opt.shipment_duration_range && (
                <p className="text-gray-500 text-xs mt-1">
                  Estimasi: {opt.shipment_duration_range} hari
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <p className="font-bold text-pink-600 text-right">
                Rp {opt.price.toLocaleString('id-ID')}
              </p>
              <input
                type="radio"
                name="shipping"
                checked={selectedShipping?.id === opt.id}
                onChange={() => setSelectedShipping(opt)}
                className="w-5 h-5 text-pink-500 cursor-pointer"
              />
            </div>
          </label>
        ))}
      </div>
      
      {shippingOptions.length > 0 && (
        <p className="text-xs text-gray-500 mt-4 text-center">
          💡 Pilih opsi pengiriman termurah atau tercepat sesuai kebutuhan Anda
        </p>
      )}
    </section>
  );
};

export default OrderShipping;