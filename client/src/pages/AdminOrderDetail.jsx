import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavbarAdmin from '../components/layout/NavbarAdmin';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const AdminOrderDetail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams(); // ambil ID order dari route

  // Dummy data order
  const [order, setOrder] = useState({
    id: orderId,
    date: '2025-10-04',
    status: 'Belum diproses', // bisa 'Sudah diproses'
    customer: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '08123456789'
    },
    items: [
      { id: 1, name: 'Boneka Teddy Bear', qty: 2, price: 250000 },
      { id: 2, name: 'Boneka Bunny', qty: 1, price: 150000 },
    ]
  });

  const handleStatusChange = () => {
    const newStatus = order.status === 'Belum diproses' ? 'Sudah diproses' : 'Belum diproses';
    setOrder({ ...order, status: newStatus });
    alert(`Status order diubah menjadi "${newStatus}"`);
  };

  const totalPrice = order.items.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <div>
      <NavbarAdmin />

      <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
        {/* Back button */}
        <button 
          className="flex items-center gap-2 text-cyan-500 mb-6 hover:underline"
          onClick={() => navigate('/admin/adminorder')}
        >
          <ArrowLeft className="w-5 h-5" /> Kembali ke List Order
        </button>

        <h2 className="text-2xl font-bold text-pink-600 mb-4">Detail Order #{order.id}</h2>

        {/* Customer info */}
        <div className="mb-6 p-4 bg-pink-50 rounded-xl shadow-sm">
          <h3 className="font-semibold text-lg">Data Pelanggan</h3>
          <p>Nama: {order.customer.name}</p>
          <p>Email: {order.customer.email}</p>
          <p>Telepon: {order.customer.phone}</p>
          <p>Tanggal Order: {order.date}</p>
          <p>Status: 
            <span className={`ml-2 font-bold ${order.status === 'Sudah diproses' ? 'text-green-600' : 'text-red-600'}`}>
              {order.status}
            </span>
          </p>
        </div>

        {/* Order items */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse">
            <thead className="bg-pink-50 border-b-2 border-pink-100">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Produk</th>
                <th className="px-4 py-3 text-left">Qty</th>
                <th className="px-4 py-3 text-left">Harga</th>
                <th className="px-4 py-3 text-left">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-pink-50 transition-colors">
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.qty}</td>
                  <td className="px-4 py-3">Rp {item.price.toLocaleString()}</td>
                  <td className="px-4 py-3">Rp {(item.qty * item.price).toLocaleString()}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td colSpan={4} className="px-4 py-3 text-right">Total:</td>
                <td className="px-4 py-3">Rp {totalPrice.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button 
            onClick={handleStatusChange}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white ${
              order.status === 'Belum diproses' ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {order.status === 'Belum diproses' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {order.status === 'Belum diproses' ? 'Tandai Sudah Diproses' : 'Tandai Belum Diproses'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
