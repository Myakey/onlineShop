import { CreditCard } from "lucide-react";

const OrderPayment = ({ paymentMethods, selectedPayment, setSelectedPayment }) => {
  return (
    <section className="bg-white rounded-3xl shadow-md p-6 border-2 border-pink-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <CreditCard className="w-6 h-6 text-pink-500" />
        Metode Pembayaran
      </h2>
      <div className="space-y-3">
        {paymentMethods.map(pm => (
          <label key={pm.id} className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
            selectedPayment.id === pm.id
              ? 'border-cyan-400 bg-gradient-to-r from-pink-50 to-cyan-50 shadow-md'
              : 'border-gray-200 hover:border-pink-300 bg-white'
          }`}>
            <span className="font-bold text-gray-800">{pm.name}</span>
            <input
              type="radio"
              name="payment"
              checked={selectedPayment.id === pm.id}
              onChange={() => setSelectedPayment(pm)}
            />
          </label>
        ))}
      </div>
    </section>
  );
};

export default OrderPayment;
