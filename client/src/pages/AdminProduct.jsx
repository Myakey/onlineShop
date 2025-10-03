import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../components/layout/NavbarAdmin';
import { Plus, Edit3, Trash2, Eye } from 'lucide-react';

const AdminProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([
    { id: 1, name: 'Boneka Teddy Bear', price: 100000, stock: 10 },
    { id: 2, name: 'Boneka Kelinci', price: 120000, stock: 8 },
    { id: 3, name: 'Boneka Panda', price: 150000, stock: 5 },
    { id: 4, name: 'Boneka Gajah', price: 200000, stock: 2 },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openModal = (product = null) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalOpen(false);
  };

  const handleAddProduct = () => openModal();
  const handleEditProduct = (product) => openModal(product);
  const handleDeleteProduct = (product) => alert('Hapus produk: ' + product.name);

  const handleViewDetail = (product) => {
    navigate(`/admin/products/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50">
      <NavbarAdmin />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Produk</h2>
          <button
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white rounded-xl flex items-center gap-2 hover:from-pink-600 hover:to-cyan-600 transition-all shadow-lg"
            onClick={handleAddProduct}
          >
            <Plus size={18} /> Tambah Produk
          </button>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-2xl border-2 border-pink-100 shadow-lg overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-pink-50 border-b-2 border-pink-100">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Nama Produk</th>
                <th className="px-4 py-3">Harga</th>
                <th className="px-4 py-3">Stok</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, idx) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-pink-50 transition-colors">
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">Rp {p.price.toLocaleString()}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      className="p-2 bg-white border-2 border-cyan-200 text-cyan-600 rounded-lg hover:bg-cyan-50 transition-all"
                      onClick={() => handleEditProduct(p)}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      className="p-2 bg-white border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all"
                      onClick={() => handleDeleteProduct(p)}
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      className="p-2 bg-white border-2 border-pink-200 text-pink-600 rounded-lg hover:bg-pink-50 transition-all"
                      onClick={() => handleViewDetail(p)}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {selectedProduct ? 'Edit Produk' : 'Tambah Produk'}
              </h3>

              <form className="space-y-4">
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Nama Produk</label>
                  <input type="text" className="w-full border-2 border-pink-100 rounded-xl px-3 py-2" defaultValue={selectedProduct ? selectedProduct.name : ''} />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-1">Harga</label>
                  <input type="number" className="w-full border-2 border-pink-100 rounded-xl px-3 py-2" defaultValue={selectedProduct ? selectedProduct.price : ''} />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-1">Stok</label>
                  <input type="number" className="w-full border-2 border-pink-100 rounded-xl px-3 py-2" defaultValue={selectedProduct ? selectedProduct.stock : ''} />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" className="px-4 py-2 bg-gray-200 rounded-xl" onClick={closeModal}>Batal</button>
                  <button type="submit" className="px-4 py-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white rounded-xl">
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProduct;
