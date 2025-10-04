import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarUser from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus,
  Heart,
  ShoppingBag,
  Tag,
  ArrowRight,
  Package,
  Sparkles
} from "lucide-react";

import { useCart } from "../context/cartContext";

const Cart = () => {
  const navigate = useNavigate();
  const { fetchCart, updateItem, removeItem, clearCart, cart, loading } = useCart();
  
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Boneka Teddy Bear Pink",
      description: "Boneka beruang lembut dan menggemaskan",
      price: 125000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?w=200&h=200&fit=crop",
      category: "Boneka Beruang",
      inStock: true
    },
    {
      id: 2,
      name: "Boneka Kelinci Putih",
      description: "Boneka kelinci super lucu",
      price: 95000,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1585174479386-d8e8c89a3440?w=200&h=200&fit=crop",
      category: "Boneka Kelinci",
      inStock: true
    },
    {
      id: 3,
      name: "Boneka Kucing Orange",
      description: "Boneka kucing imut banget",
      price: 110000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=200&h=200&fit=crop",
      category: "Boneka Kucing",
      inStock: true
    }
  ]);

  const [selectedItems, setSelectedItems] = useState([1, 2, 3]);
  const [wishlist, setWishlist] = useState([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Remove item
  // const removeItem = (id) => {
  //   setCartItems(cartItems.filter(item => item.id !== id));
  //   setSelectedItems(selectedItems.filter(itemId => itemId !== id));
  // };

  // Toggle item selection
  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Select all items
  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
    }
  };

  // Add to wishlist
  const addToWishlist = (id) => {
    if (!wishlist.includes(id)) {
      setWishlist([...wishlist, id]);
      setTimeout(() => {
        removeItem(id);
      }, 500);
    }
  };

  // Apply voucher
  const applyVoucher = () => {
    const vouchers = {
      "BONEKA10": { discount: 10, type: "percentage", name: "Diskon 10%" },
      "PROMO20": { discount: 20, type: "percentage", name: "Diskon 20%" },
      "HEMAT50K": { discount: 50000, type: "fixed", name: "Potongan Rp 50.000" }
    };

    const voucher = vouchers[voucherCode.toUpperCase()];
    if (voucher) {
      setAppliedVoucher(voucher);
    } else {
      alert("❌ Kode voucher tidak valid!");
      setAppliedVoucher(null);
    }
  };

  // Calculate totals
  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
  const subtotal = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let discount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.type === "percentage") {
      discount = (subtotal * appliedVoucher.discount) / 100;
    } else {
      discount = appliedVoucher.discount;
    }
  }
  
  const total = subtotal - discount;

  // Checkout
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("⚠️ Pilih minimal 1 produk untuk checkout!");
      return;
    }
    navigate("/order");
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 via-cyan-50 to-white min-h-screen">
      <NavbarUser currentPage="cart" />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-cyan-500 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <ShoppingCart className="w-10 h-10 text-pink-500" />
            Keranjang Belanja
          </h1>
          <p className="text-gray-600">
            {cartItems.length} produk boneka lucu menunggumu! 🧸
          </p>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-gradient-to-br from-pink-100 to-cyan-100 rounded-full mb-6">
              <ShoppingCart className="w-24 h-24 text-pink-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Keranjang Masih Kosong
            </h2>
            <p className="text-gray-600 mb-8">
              Yuk mulai belanja boneka lucu & imut favoritmu!
            </p>
            <button
              onClick={() => navigate("/product")}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-cyan-500 text-white rounded-2xl font-bold text-lg hover:from-pink-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-6 h-6" />
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Select All */}
              <div className="bg-white rounded-2xl shadow-md p-4 border-2 border-pink-100 flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === cartItems.length}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 rounded border-2 border-pink-300 text-cyan-500 focus:ring-2 focus:ring-cyan-300 cursor-pointer"
                  />
                  <span className="font-bold text-gray-800">
                    Pilih Semua ({cartItems.length} Produk)
                  </span>
                </label>
                {selectedItems.length > 0 && (
                  <span className="text-sm text-cyan-600 font-semibold">
                    {selectedItems.length} item dipilih
                  </span>
                )}
              </div>

              {/* Cart Items List */}
              {cartItems.map(item => (
                <div 
                  key={item.id}
                  className={`bg-white rounded-3xl shadow-md p-5 border-2 transition-all duration-300 ${
                    selectedItems.includes(item.id)
                      ? 'border-cyan-400 bg-gradient-to-br from-pink-50/30 to-cyan-50/30'
                      : 'border-pink-100'
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Checkbox */}
                    <div className="flex items-start pt-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="w-5 h-5 rounded border-2 border-pink-300 text-cyan-500 focus:ring-2 focus:ring-cyan-300 cursor-pointer"
                      />
                    </div>

                    {/* Image (klik ke detail produk) */}
                    <img 
                      src={item.image} 
                      alt={item.name}
                      onClick={() => navigate(`/product/${item.id}`)}
                      className="w-28 h-28 object-cover rounded-2xl border-2 border-white shadow-md cursor-pointer hover:scale-105 transition-transform"
                    />

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <div>
                          <h3 
                            className="font-bold text-gray-800 text-lg mb-1 cursor-pointer hover:text-pink-600"
                            onClick={() => navigate(`/product/${item.id}`)}
                          >
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.description}
                          </p>
                          <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Price */}
                        <div>
                          <p className="text-2xl font-bold text-pink-600">
                            Rp {item.price.toLocaleString('id-ID')}
                          </p>
                          <p className="text-sm text-gray-500">
                            Total: Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          {/* Quantity */}
                          <div className="flex items-center gap-2 bg-gradient-to-r from-pink-50 to-cyan-50 rounded-xl border-2 border-pink-200 px-3 py-2">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-pink-500 hover:bg-pink-100 rounded-lg transition-colors font-bold"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-bold text-gray-800 w-8 text-center">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-cyan-500 hover:bg-cyan-100 rounded-lg transition-colors font-bold"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Wishlist */}
                          <button
                            onClick={() => addToWishlist(item.id)}
                            className={`p-3 rounded-xl transition-all duration-300 ${
                              wishlist.includes(item.id)
                                ? 'bg-red-100 text-red-500'
                                : 'bg-gray-100 text-gray-400 hover:bg-pink-100 hover:text-pink-500'
                            }`}
                            title="Pindah ke Wishlist"
                          >
                            <Heart className={`w-5 h-5 ${wishlist.includes(item.id) ? 'fill-current' : ''}`} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-3 bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500 rounded-xl transition-all duration-300"
                            title="Hapus dari Keranjang"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping */}
              <button
                onClick={() => navigate("/product")}
                className="w-full py-4 bg-white border-2 border-pink-200 text-pink-600 rounded-2xl font-bold hover:bg-gradient-to-r hover:from-pink-50 hover:to-cyan-50 hover:border-cyan-300 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Package className="w-5 h-5" />
                Lanjut Belanja Boneka Lainnya
              </button>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Voucher Section */}
                <section className="bg-white rounded-3xl shadow-md p-6 border-2 border-pink-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-pink-500" />
                    Kode Voucher
                  </h2>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                        placeholder="Masukkan kode"
                        className="flex-1 px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors uppercase"
                      />
                      <button 
                        onClick={applyVoucher}
                        className="px-6 py-3 bg-gradient-to-r from-pink-400 to-cyan-400 text-white rounded-xl font-bold hover:from-pink-500 hover:to-cyan-500 transition-all duration-300 shadow-md"
                      >
                        Pakai
                      </button>
                    </div>
                    
                    {appliedVoucher && (
                      <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 px-4 py-3 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-green-600" />
                          <span className="font-bold text-green-700 text-sm">
                            {appliedVoucher.name} diterapkan!
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setAppliedVoucher(null);
                            setVoucherCode("");
                          }}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div className="text-xs text-gray-600 space-y-1 bg-gradient-to-r from-pink-50 to-cyan-50 p-3 rounded-xl">
                      <p className="font-semibold mb-1">💝 Kode tersedia:</p>
                      <p>• BONEKA10 - Diskon 10%</p>
                      <p>• PROMO20 - Diskon 20%</p>
                      <p>• HEMAT50K - Potongan Rp 50.000</p>
                    </div>
                  </div>
                </section>

                {/* Order Summary */}
                <section className="bg-gradient-to-br from-pink-100 to-cyan-100 rounded-3xl shadow-lg p-6 border-2 border-pink-200">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    📋 Ringkasan Belanja
                  </h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal ({selectedItems.length} item)</span>
                      <span className="font-semibold">
                        Rp {subtotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                    
                    {appliedVoucher && discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Diskon Voucher</span>
                        <span className="font-semibold">
                          - Rp {discount.toLocaleString('id-ID')}
                        </span>
                      </div>
                    )}
                    
                    <hr className="border-gray-300" />
                    
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                      <span>Total</span>
                      <span className="text-pink-600">
                        Rp {total.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0}
                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-cyan-500 text-white rounded-2xl font-bold text-lg hover:from-pink-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    Checkout Sekarang
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <p className="text-xs text-gray-600 text-center mt-3">
                    ✨ Gratis ongkir untuk pembelian di atas Rp 200.000
                  </p>
                </section>

                {/* Trust Badges */}
                <section className="bg-white rounded-2xl shadow-md p-4 border-2 border-pink-100">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 bg-gradient-to-br from-pink-50 to-cyan-50 rounded-xl">
                      <p className="text-2xl mb-1">🔒</p>
                      <p className="text-xs font-semibold text-gray-700">Pembayaran Aman</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-cyan-50 to-pink-50 rounded-xl">
                      <p className="text-2xl mb-1">🚚</p>
                      <p className="text-xs font-semibold text-gray-700">Pengiriman Cepat</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-pink-50 to-cyan-50 rounded-xl">
                      <p className="text-2xl mb-1">✅</p>
                      <p className="text-xs font-semibold text-gray-700">Produk Original</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-cyan-50 to-pink-50 rounded-xl">
                      <p className="text-2xl mb-1">💝</p>
                      <p className="text-xs font-semibold text-gray-700">Garansi 30 Hari</p>
                    </div>
                  </div>
                </section>

              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
