const OrderSummary = ({ products, selectedShipping, voucher }) => {
  const subtotal = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const shippingCost = selectedShipping.price || 0;
  const discount = voucher ? 20000 : 0; // contoh diskon fix
  const total = subtotal + shippingCost - discount;

  return (
    <section className="bg-white rounded-3xl shadow-md p-6 border-2 border-pink-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Ringkasan Pesanan</h2>
      <div className="space-y-2 text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>Rp {subtotal.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between">
          <span>Ongkir</span>
          <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
        </div>
        {voucher && (
          <div className="flex justify-between text-pink-500 font-bold">
            <span>Diskon Voucher</span>
            <span>- Rp {discount.toLocaleString('id-ID')}</span>
          </div>
        )}
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-xl text-gray-900">
          <span>Total</span>
          <span>Rp {total.toLocaleString('id-ID')}</span>
        </div>
      </div>
      <button className="mt-5 w-full py-3 bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-bold rounded-2xl hover:opacity-90 transition">
        Buat Pesanan
      </button>
    </section>
  );
};

export default OrderSummary;
