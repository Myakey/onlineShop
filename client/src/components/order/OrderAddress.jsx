import { MapPin, Edit, Trash2, Plus } from "lucide-react";

const OrderAddress = ({ addresses, selectedAddress, setSelectedAddress, deleteAddress, editAddress }) => {
  return (
    <section className="bg-white rounded-3xl shadow-md p-6 border-2 border-pink-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-pink-500" />
          Alamat Pengiriman
        </h2>
        <button className="text-cyan-500 hover:text-cyan-600 font-medium flex items-center gap-1 transition-colors">
          <Plus className="w-5 h-5" /> Tambah
        </button>
      </div>

      <div className="space-y-3">
        {addresses.map(addr => (
          <div
            key={addr.id}
            onClick={() => setSelectedAddress(addr)}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
              selectedAddress.id === addr.id
                ? 'border-cyan-400 bg-gradient-to-r from-pink-50 to-cyan-50 shadow-md'
                : 'border-gray-200 hover:border-pink-300 bg-white'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-bold">{addr.title}</span>
                  {addr.isDefault && (
                    <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-semibold">Utama</span>
                  )}
                </div>
                <p className="font-bold text-gray-800 mb-1">{addr.name}</p>
                <p className="text-gray-600 text-sm mb-1">{addr.phone}</p>
                <p className="text-gray-600 text-sm">{addr.text}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); editAddress(addr.id); }}
                  className="p-2 text-cyan-500 hover:bg-cyan-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteAddress(addr.id); }}
                  className="p-2 text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OrderAddress;
