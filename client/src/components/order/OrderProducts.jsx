import { Package, Trash2 } from "lucide-react";

const OrderProducts = ({ products, updateQuantity, removeProduct }) => {
  return (
    <section className="bg-white rounded-3xl shadow-md p-6 border-2 border-pink-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Package className="w-6 h-6 text-pink-500" />
        Daftar Pesanan ({products.length} Produk)
      </h2>
      <div className="space-y-4">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="flex gap-4 p-4 bg-gradient-to-r from-pink-50/50 to-cyan-50/50 rounded-2xl border border-pink-100 hover:shadow-md transition-shadow">
              <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-xl border-2 border-white shadow-md" />
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg mb-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-pink-600 font-bold text-xl">Rp {product.price.toLocaleString('id-ID')}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white rounded-lg border border-pink-200 px-3 py-1">
                      <button onClick={() => updateQuantity(product.id, product.quantity - 1)} className="text-pink-500 font-bold w-6 h-6 flex items-center justify-center hover:bg-pink-50 rounded">-</button>
                      <span className="font-bold text-gray-800 w-8 text-center">{product.quantity}</span>
                      <button onClick={() => updateQuantity(product.id, product.quantity + 1)} className="text-cyan-500 font-bold w-6 h-6 flex items-center justify-center hover:bg-cyan-50 rounded">+</button>
                    </div>
                    <button onClick={() => removeProduct(product.id)} className="p-2 text-pink-500 hover:bg-pink-50 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-lg">Keranjang masih kosong</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default OrderProducts;
