import { Tag } from "lucide-react";

const OrderVoucher = ({ voucher, setVoucher }) => {
  return (
    <section className="bg-white rounded-3xl shadow-md p-6 border-2 border-pink-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Tag className="w-6 h-6 text-pink-500" />
        Kode Voucher
      </h2>
      <div className="flex gap-3">
        <input
          type="text"
          value={voucher}
          onChange={(e) => setVoucher(e.target.value)}
          placeholder="Masukkan kode voucher"
          className="flex-1 border-2 border-pink-200 rounded-xl px-4 py-2 focus:border-cyan-400 outline-none"
        />
        <button className="px-5 py-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white rounded-xl font-bold hover:opacity-90 transition">
          Terapkan
        </button>
      </div>
    </section>
  );
};

export default OrderVoucher;
