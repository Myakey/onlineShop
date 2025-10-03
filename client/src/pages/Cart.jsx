import { useCart } from "../context/cartContext";

const CartPage = () => {
  const { cart, loading, updateItem, removeItem, clearCart } = useCart();

  if (loading) return <p className="text-center text-pink-600">Loading cart...</p>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 via-white to-cyan-50">
        <h2 className="text-3xl font-bold text-pink-700 mb-4">🛒 Keranjang Kosong</h2>
        <p className="text-gray-600">Yuk, tambahkan produk favoritmu!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-cyan-50 py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8 border border-cyan-100">
        <h2 className="text-3xl font-bold text-pink-700 mb-8">🛍️ Keranjang Saya</h2>

        <div className="space-y-6">
          {cart?.items?.map((item) => (
            <div
              key={item.cart_item_id}
              className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-cyan-50 shadow-sm hover:shadow-md transition"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-2xl border border-cyan-100 shadow"
                />
                <div>
                  <h3 className="font-semibold text-lg text-pink-700">{item.product.name}</h3>
                  <p className="text-gray-500 text-sm">{item.product.description}</p>
                  <p className="text-cyan-600 font-bold">Rp {item.product.price}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => updateItem(item.cart_item_id, item.quantity + 1)}
                  className="px-3 py-1 bg-cyan-100 text-cyan-600 rounded-full hover:bg-cyan-200 transition"
                >
                  ➕
                </button>
                <button
                  onClick={() => updateItem(item.cart_item_id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition disabled:opacity-50"
                >
                  ➖
                </button>
                <button
                  onClick={() => removeItem(item.cart_item_id)}
                  className="px-3 py-1 bg-gradient-to-r from-pink-400 to-cyan-400 text-white rounded-full hover:from-pink-500 hover:to-cyan-500 transition shadow"
                >
                  ❌ Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-8 flex items-center justify-between border-t pt-6">
          <p className="text-lg font-semibold text-gray-700">
            Total Items: <span className="text-cyan-600">{cart.totalItems}</span>
          </p>
          <p className="text-2xl font-bold text-pink-700">
            Total: Rp {cart.totalAmount}
          </p>
        </div>

        {/* Clear Cart */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={clearCart}
            className="px-6 py-3 bg-gradient-to-r from-pink-400 to-cyan-400 text-white rounded-2xl font-semibold shadow-md hover:from-pink-500 hover:to-cyan-500 transition transform hover:scale-105"
          >
            🗑️ Kosongkan Keranjang
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
