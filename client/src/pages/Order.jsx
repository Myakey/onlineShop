import React, { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import OrderAddress from "../components/order/OrderAddress";
import OrderProducts from "../components/order/OrderProducts";
import OrderShipping from "../components/order/OrderShipping";
import OrderPayment from "../components/order/OrderPayment";
import OrderVoucher from "../components/order/OrderVoucher";
import OrderSummary from "../components/order/OrderSummary";

const Order = () => {
  const [addresses, setAddresses] = useState([
    { id: 1, title: "Rumah", name: "Yehezkiel", phone: "08123456789", text: "Jl. Melati No. 123, Jakarta", isDefault: true },
    { id: 2, title: "Kantor", name: "Yehezkiel", phone: "08987654321", text: "Jl. Mawar No. 456, Tangerang", isDefault: false },
  ]);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]);

  const [products, setProducts] = useState([
    { id: 1, name: "Boneka Teddy", description: "Boneka imut ukuran besar", price: 150000, quantity: 1, image: "https://via.placeholder.com/100" },
    { id: 2, name: "Boneka Panda", description: "Boneka panda lucu", price: 120000, quantity: 2, image: "https://via.placeholder.com/100" },
  ]);

  const [shippingOptions] = useState([
    { id: 1, name: "JNE Reguler", duration: "2-4 hari", price: 20000 },
    { id: 2, name: "J&T Express", duration: "1-3 hari", price: 25000 },
    { id: 3, name: "SiCepat", duration: "1-2 hari", price: 30000 },
  ]);
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0]);

  const [paymentMethods] = useState([
    { id: 1, name: "Transfer Bank" },
    { id: 2, name: "COD (Bayar di Tempat)" },
    { id: 3, name: "E-Wallet (OVO, GoPay, DANA)" },
  ]);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]);

  const [voucher, setVoucher] = useState("");

  // function update
  const updateQuantity = (id, qty) => {
    setProducts(products.map(p => p.id === id ? { ...p, quantity: Math.max(1, qty) } : p));
  };

  const removeProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const deleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const editAddress = (id) => {
    alert("Edit alamat id: " + id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50">
      <Navbar currentPage="order" />

      <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-2">
          <OrderAddress
            addresses={addresses}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            deleteAddress={deleteAddress}
            editAddress={editAddress}
          />
          <OrderProducts
            products={products}
            updateQuantity={updateQuantity}
            removeProduct={removeProduct}
          />
          <OrderShipping
            shippingOptions={shippingOptions}
            selectedShipping={selectedShipping}
            setSelectedShipping={setSelectedShipping}
          />
          <OrderPayment
            paymentMethods={paymentMethods}
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
          />
          <OrderVoucher
            voucher={voucher}
            setVoucher={setVoucher}
          />
        </div>

        <div className="lg:col-span-1">
          <OrderSummary
            products={products}
            selectedShipping={selectedShipping}
            voucher={voucher}
          />
        </div>
      </div>
    </div>
  );
};

export default Order;
