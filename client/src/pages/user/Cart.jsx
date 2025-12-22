// src/pages/user/Cart.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import NavbarUser from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
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
  Loader2,
  AlertCircle,
} from "lucide-react";

import { useCart } from "../../context/cartContext";
import cartService from "../../services/cartService";

const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
};

const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading, updateItem, removeItem, clearCart, fetchCart } =
    useCart();

  const [selectedItems, setSelectedItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // ✅ stable reference
  const cartItems = useMemo(() => cart?.items ?? [], [cart?.items]);

  // ✅ backend routes use :productId, and payload has product_id
  const getItemId = (item) => item?.product_id;

  useEffect(() => {
    const nextSelected =
      cartItems.length > 0 ? cartItems.map((item) => getItemId(item)) : [];

    // ✅ prevent max update depth (avoid setting same state repeatedly)
    setSelectedItems((prev) =>
      arraysEqual(prev, nextSelected) ? prev : nextSelected
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setActionLoading(productId);
    try {
      await updateItem(productId, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("❌ Gagal mengupdate jumlah produk!");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!window.confirm("Yakin ingin menghapus produk ini dari keranjang?")) {
      return;
    }

    setActionLoading(productId);
    try {
      await removeItem(productId);
      setSelectedItems((prev) => prev.filter((id) => id !== productId));
    } catch (error) {
      console.error("Error removing item:", error);
      alert("❌ Gagal menghapus produk!");
    } finally {
      setActionLoading(null);
    }
  };

  const toggleSelectItem = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedItems((prev) =>
      prev.length === cartItems.length ? [] : cartItems.map((i) => getItemId(i))
    );
  };

  const addToWishlist = async (productId) => {
    if (!wishlist.includes(productId)) {
      setWishlist((prev) => [...prev, productId]);
      setTimeout(() => {
        handleRemoveItem(productId);
      }, 500);
    }
  };

  const applyVoucher = () => {
    const vouchers = {
      BONEKA10: { discount: 10, type: "percentage", name: "Diskon 10%" },
      PROMO20: { discount: 20, type: "percentage", name: "Diskon 20%" },
      HEMAT50K: { discount: 50000, type: "fixed", name: "Potongan Rp 50.000" },
    };

    const voucher = vouchers[voucherCode.toUpperCase()];
    if (voucher) {
      setAppliedVoucher(voucher);
    } else {
      alert("❌ Kode voucher tidak valid!");
      setAppliedVoucher(null);
    }
  };

  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.includes(getItemId(item))
  );

  const subtotal = selectedCartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );

  let discount = 0;
  if (appliedVoucher) {
    discount =
      appliedVoucher.type === "percentage"
        ? (subtotal * appliedVoucher.discount) / 100
        : appliedVoucher.discount;
  }

  const total = subtotal - discount;

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      alert("⚠️ Pilih minimal 1 produk untuk checkout!");
      return;
    }

    const itemsForValidation = selectedCartItems
      .filter((item) => item && item.product && item.product.product_id)
      .map((item) => ({
        product_id: item.product.product_id,
        quantity: item.quantity,
      }));

    const stockIssues = selectedCartItems.filter(
      (item) => item.quantity > item.product.stock
    );
    if (stockIssues.length > 0) {
      const outOfStockNames = stockIssues.map((i) => i.product.name).join(", ");
      alert(
        `❌ Stok lokal tidak mencukupi untuk: ${outOfStockNames}. Mohon sesuaikan jumlahnya.`
      );
      return;
    }

    setActionLoading("checkout");
    try {
      const validation = await cartService.validateCart(itemsForValidation);

      if (!validation.valid) {
        const message =
          validation.message || "Beberapa item tidak tersedia lagi.";
        alert(`❌ Gagal checkout: ${message}`);
        await fetchCart();
        return;
      }

      const subtotal = selectedCartItems.reduce(
        (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
        0
      );

      let discount = 0;
      if (appliedVoucher) {
        discount =
          appliedVoucher.type === "percentage"
            ? (subtotal * appliedVoucher.discount) / 100
            : appliedVoucher.discount;
      }

      const total = subtotal - discount;

      const checkoutData = {
        selectedItems: selectedCartItems,
        subtotal,
        discount,
        total,
        appliedVoucher: appliedVoucher
          ? { ...appliedVoucher, code: voucherCode }
          : null,
      };

      sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));
      navigate("/order");
    } catch (error) {
      console.error(
        "Error during checkout validation:",
        error.response?.data?.message || error
      );
      alert(
        `❌ Checkout gagal. ${
          error.response?.data?.message || "Terjadi kesalahan sistem."
        }`
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Yakin ingin mengosongkan keranjang?")) {
      return;
    }

    try {
      await clearCart();
      setSelectedItems([]);
      setAppliedVoucher(null);
      setVoucherCode("");
    } catch (error) {
      console.error("Error clearing cart:", error);
      alert("❌ Gagal mengosongkan keranjang!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <NavbarUser currentPage="cart" />
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-pink-100">
                <Loader2 className="h-7 w-7 animate-spin text-pink-500" />
              </div>
              <p className="font-semibold text-gray-900">Memuat keranjang...</p>
              <p className="mt-1 text-sm text-gray-500">
                Mohon tunggu sebentar
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <NavbarUser currentPage="cart" />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-pink-100">
                <ShoppingCart className="h-6 w-6 text-pink-500" />
              </span>
              Keranjang
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {cartItems.length} item siap di checkout
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-pink-600 shadow-sm ring-1 ring-pink-100 transition hover:-translate-y-0.5 hover:bg-pink-50"
            >
              <ShoppingBag className="h-4 w-4" />
              Lanjut belanja
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-3xl border border-pink-100 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-pink-50 ring-1 ring-pink-100">
              <ShoppingCart className="h-9 w-9 text-pink-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              Keranjang masih kosong
            </h2>
            <p className="mx-auto mt-2 max-w-md text-gray-600">
              Pilih produk favoritmu dan tambahkan ke keranjang.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-pink-600 px-8 py-4 text-base font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-pink-700 active:translate-y-0"
            >
              <Package className="h-5 w-5" />
              Mulai belanja
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.65fr_0.95fr]">
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.length === cartItems.length &&
                      cartItems.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="h-5 w-5 cursor-pointer accent-pink-600"
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    Pilih semua
                  </span>
                  <span className="text-sm text-gray-500">
                    ({cartItems.length})
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  {selectedItems.length > 0 && (
                    <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700 ring-1 ring-pink-100">
                      {selectedItems.length} dipilih
                    </span>
                  )}
                  <button
                    onClick={handleClearCart}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-gray-700 ring-1 ring-pink-100 transition hover:-translate-y-0.5 hover:bg-pink-50"
                  >
                    <Trash2 className="h-4 w-4 text-gray-600" />
                    Hapus semua
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {cartItems.map((item) => {
                  const product = item.product;
                  const itemId = getItemId(item); // ✅ product_id
                  const isLoading = actionLoading === itemId;
                  const selected = selectedItems.includes(itemId);

                  return (
                    <div
                      key={itemId}
                      className={[
                        "rounded-2xl border bg-white p-4 shadow-sm transition",
                        selected ? "border-pink-200" : "border-pink-100",
                        "hover:-translate-y-0.5 hover:shadow-md",
                        isLoading ? "opacity-60" : "",
                      ].join(" ")}
                    >
                      <div className="flex gap-4">
                        <div className="pt-1.5">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleSelectItem(itemId)}
                            disabled={isLoading}
                            className="h-5 w-5 cursor-pointer accent-pink-600 disabled:opacity-50"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/product/${product.product_id}`)
                          }
                          className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-pink-50 ring-1 ring-pink-100"
                          title="Lihat produk"
                        >
                          <img
                            src={
                              product.images.find((img) => img.is_primary)
                                ?.image_url || "https://via.placeholder.com/150"
                            }
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(`/product/${product.product_id}`)
                                }
                                className="line-clamp-1 text-left text-base font-bold text-gray-900 hover:text-pink-700"
                              >
                                {product.name}
                              </button>

                              <p className="mt-1 text-sm text-gray-600">
                                Rp{" "}
                                {parseFloat(product.price).toLocaleString(
                                  "id-ID"
                                )}
                              </p>

                              {product.stock < item.quantity && (
                                <div className="mt-2 inline-flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-2.5 py-1.5">
                                  <AlertCircle className="h-4 w-4 text-yellow-700" />
                                  <span className="text-xs font-semibold text-yellow-800">
                                    Stok tersisa: {product.stock}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">
                                Rp{" "}
                                {(
                                  parseFloat(product.price) * item.quantity
                                ).toLocaleString("id-ID")}
                              </p>
                              <p className="text-xs text-gray-500">Total item</p>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="inline-flex items-center rounded-full border border-pink-100 bg-white p-1 shadow-sm">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(itemId, item.quantity - 1)
                                }
                                disabled={isLoading || item.quantity <= 1}
                                className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-pink-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Kurangi jumlah"
                              >
                                <Minus className="h-4 w-4 text-gray-900" />
                              </button>

                              <div className="grid w-10 place-items-center text-sm font-bold text-gray-900">
                                {isLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin text-pink-600" />
                                ) : (
                                  item.quantity
                                )}
                              </div>

                              <button
                                onClick={() =>
                                  handleUpdateQuantity(itemId, item.quantity + 1)
                                }
                                disabled={isLoading || item.quantity >= product.stock}
                                className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-pink-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Tambah jumlah"
                              >
                                <Plus className="h-4 w-4 text-gray-900" />
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => addToWishlist(itemId)}
                                disabled={isLoading}
                                className={[
                                  "grid h-10 w-10 place-items-center rounded-full border bg-white shadow-sm transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50",
                                  wishlist.includes(itemId)
                                    ? "border-pink-200 text-pink-600"
                                    : "border-pink-100 text-gray-600 hover:bg-pink-50",
                                ].join(" ")}
                                title="Pindahkan ke Wishlist"
                              >
                                <Heart
                                  className={[
                                    "h-5 w-5",
                                    wishlist.includes(itemId) ? "fill-current" : "",
                                  ].join(" ")}
                                />
                              </button>

                              <button
                                onClick={() => handleRemoveItem(itemId)}
                                disabled={isLoading}
                                className="grid h-10 w-10 place-items-center rounded-full border border-pink-100 bg-white text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-pink-50 active:translate-y-0 disabled:opacity-50"
                                title="Hapus"
                              >
                                {isLoading ? (
                                  <Loader2 className="h-5 w-5 animate-spin text-pink-600" />
                                ) : (
                                  <Trash2 className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => navigate("/products")}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-pink-100 bg-white px-6 py-3.5 text-sm font-bold text-pink-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-pink-50 active:translate-y-0"
              >
                <ShoppingBag className="h-4 w-4" />
                Lanjut belanja
              </button>
            </section>

            <aside className="space-y-4 lg:sticky lg:top-24">
              <section className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
                  <Tag className="h-4 w-4 text-pink-600" />
                  Voucher
                </h2>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) =>
                      setVoucherCode(e.target.value.toUpperCase())
                    }
                    placeholder="Masukkan kode"
                    className="w-full flex-1 rounded-full border border-pink-100 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:border-pink-200 focus:ring-4 focus:ring-pink-50"
                  />
                  <button
                    onClick={applyVoucher}
                    className="rounded-full bg-pink-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-pink-700 active:translate-y-0"
                  >
                    Pakai
                  </button>
                </div>

                {appliedVoucher && (
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-pink-100 bg-pink-50 px-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-gray-900">
                        {appliedVoucher.name}
                      </p>
                      <p className="text-xs text-gray-600">Voucher aktif</p>
                    </div>
                    <button
                      onClick={() => {
                        setAppliedVoucher(null);
                        setVoucherCode("");
                      }}
                      className="grid h-9 w-9 place-items-center rounded-full bg-white ring-1 ring-pink-100 transition hover:bg-pink-50"
                      title="Hapus voucher"
                    >
                      <Trash2 className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
                <h2 className="text-base font-extrabold text-gray-900">
                  Ringkasan
                </h2>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>

                  {appliedVoucher && discount > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>Diskon</span>
                      <span className="font-semibold text-gray-900">
                        - Rp {discount.toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}

                  <div className="my-3 h-px w-full bg-pink-100" />

                  <div className="flex items-end justify-between">
                    <span className="text-sm font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-black tracking-tight text-pink-700">
                      Rp {total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={
                    selectedItems.length === 0 || actionLoading === "checkout"
                  }
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-pink-600 px-6 py-4 text-base font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-pink-700 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {actionLoading === "checkout" ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Memvalidasi...
                    </>
                  ) : (
                    <>
                      Checkout <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-xs text-gray-500">
                  Gratis ongkir untuk pembelian di atas Rp 200.000
                </p>
              </section>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
