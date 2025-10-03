import { Truck } from "lucide-react";

const OrderShipping = ({ shippingOptions, selectedShipping, setSelectedShipping }) => {
  return (
    <section className="bg-white rounded-3xl shadow-md p-6 border-2 border-pink-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Truck className="w-6 h-6 text-pink-500" />
        Opsi Pengiriman
      </h2>
      <div className="space-y-3">
        {shippingOptions.map(opt => (
          <label key={opt.id} className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
            selectedShipping.id === opt.id
              ? 'border-cyan-400 bg-gradient-to-r from-pink-50 to-cyan-50 shadow-md'
              : 'border-gray-200 hover:border-pink-300 bg-white'
          }`}>
            <div>
              <p className="font-bold text-gray-800">{opt.name}</p>
              <p className="text-gray-600 text-sm">{opt.duration}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-bold text-pink-600">Rp {opt.price.toLocaleString('id-ID')}</p>
              <input
                type="radio"
                name="shipping"
                checked={selectedShipping.id === opt.id}
                onChange={() => setSelectedShipping(opt)}
              />
            </div>
          </label>
        ))}
      </div>
    </section>
  );
};

export default OrderShipping;
