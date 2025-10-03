import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../components/layout/NavbarAdmin';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

const AdminOrder = () => {
  const navigate = useNavigate();

  // Dummy data order
  const [orders, setOrders] = useState([
    { id: 1, customer: 'Budi Santoso', date: '2025-10-01', total: 350000, status: 'pending' },
    { id: 2, customer: 'Siti Aminah', date: '2025-10-02', total: 500000, status: 'done' },
    { id: 3, customer: 'Andi Wijaya', date: '2025-10-03', total: 150000, status: 'pending' },
  ]);

  // Toggle status order
  const toggleStatus = (orderId) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: order.status === 'done' ? 'pending' : 'done' }
          : order
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50">
      <NavbarAdmin />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Daftar Order</h2>

        <div className="bg-white rounded-2xl border-2 border-pink-100 shadow-lg overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-pink-50 border-b-2 border-pink-100">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Nama Customer</th>
                <th className="px-4 py-3">Tanggal Order</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-pink-50 transition-colors"
                >
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3">{order.customer}</td>
                  <td className="px-4 py-3">{order.date}</td>
                  <td className="px-4 py-3">Rp {order.total.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {order.status === 'done' ? (
                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Selesai
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-semibold flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    {/* Tombol Detail */}
                    <button
                      className="p-2 bg-white border-2 border-cyan-200 text-cyan-600 rounded-lg hover:bg-cyan-50 transition-all flex items-center gap-1"
                      onClick={() => navigate(`/admin/orders/${order.id}`)} // <-- arahkan ke halaman detail
                    >
                      <Eye size={16} /> Detail
                    </button>

                    {/* Tombol toggle status */}
                    <button
                      className={`p-2 border-2 rounded-lg transition-all flex items-center gap-1
                        ${order.status === 'done' 
                          ? 'bg-gray-200 border-gray-300 text-gray-600 hover:bg-gray-300' 
                          : 'bg-green-500 border-green-600 text-white hover:bg-green-600'}`}
                      onClick={() => toggleStatus(order.id)}
                    >
                      {order.status === 'done' ? 'Set Pending' : 'Set Done'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrder;
