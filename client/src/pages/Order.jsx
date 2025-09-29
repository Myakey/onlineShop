import React, { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AddressList from "../components/profile/AddressList";
import OrderItem from "../components/order/OrderItem";
import OrderSummary from "../components/order/OrderSummary";
import PaymentMethod from "../components/order/PaymentMethod";
import ShippingOptions from "../components/order/ShippingOptions";
import VoucherInput from "../components/order/VoucherInput";

const Order = () => {
  const initialProducts = [
    { id: 1, name: "Produk 1", description: "Deskripsi produk 1", price: 25, image: "https://via.placeholder.com/150" },
    { id: 2, name: "Produk 2", description: "Deskripsi produk 2", price: 40, image: "https://via.placeholder.com/150" },
  ];

  const initialAddresses = [
    { title: "Rumah", text: "Jl. Contoh No.1" },
    { title: "Kantor", text: "Jl. Contoh No.2" },
  ];

  const paymentMethods = ["Credit Card", "Bank Transfer", "COD"];
  const shippingOptions = ["Reguler", "Express", "Same Day"];

  const [products, setProducts] = useState(initialProducts);
  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]);
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0]);
  const [voucherDiscount, setVoucherDiscount] = useState(0);

  const removeProduct = (id) => setProducts(products.filter(p => p.id !== id));
  const applyVoucher = (code) => code === "DISKON10" ? setVoucherDiscount(10) : setVoucherDiscount(0);
  const deleteAddress = (index) => setAddresses(addresses.filter((_, i) => i !== index));
  const editAddress = (index) => alert("Fitur edit alamat belum tersedia");
  const placeOrder = () => {
    alert(`Order berhasil!\nMetode Pembayaran: ${selectedPayment}\nMetode Pengiriman: ${selectedShipping}\nTotal Produk: ${products.length}`);
  };

  const totalPrice = products.reduce((sum, p) => sum + p.price, 0) - voucherDiscount;

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto p-6 space-y-6">

        {/* Alamat Pengiriman */}
        <section>
          <h2 className="text-xl font-bold mb-2">Alamat Pengiriman</h2>
          <AddressList
            addresses={addresses}
            onDeleteAddress={deleteAddress}
            onEditAddress={editAddress}
          />
        </section>

        {/* Daftar Produk */}
        <section>
          <h2 className="text-xl font-bold mb-2">Daftar Pesanan</h2>
          <div className="space-y-4">
            {products.length > 0 ? (
              products.map(product => (
                <OrderItem key={product.id} product={product} onRemove={removeProduct} />
              ))
            ) : (
              <p className="text-gray-400">Keranjang kosong</p>
            )}
          </div>
        </section>

        {/* Opsi Pengiriman */}
        <section>
          <h2 className="text-xl font-bold mb-2">Opsi Pengiriman</h2>
          <ShippingOptions
            options={shippingOptions}
            selected={selectedShipping}
            onSelect={setSelectedShipping}
          />
        </section>

        {/* Metode Pembayaran */}
        <section>
          <h2 className="text-xl font-bold mb-2">Metode Pembayaran</h2>
          <PaymentMethod
            methods={paymentMethods}
            selected={selectedPayment}
            onSelect={setSelectedPayment}
          />
        </section>

        {/* Voucher */}
        <section>
          <h2 className="text-xl font-bold mb-2">Voucher</h2>
          <VoucherInput onApply={applyVoucher} />
          {voucherDiscount > 0 && (
            <p className="text-green-400 mt-1">Diskon diterapkan: ${voucherDiscount}</p>
          )}
        </section>

        {/* Ringkasan Pesanan */}
        <section>
          <OrderSummary total={totalPrice} onPlaceOrder={placeOrder} />
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Order;
