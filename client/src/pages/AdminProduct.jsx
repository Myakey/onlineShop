import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../components/layout/NavbarAdmin";
import { Edit3, Trash2, Eye, Plus } from "lucide-react";

const AdminProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
  });

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Open modal for add/edit
  const openModal = (product = null) => {
    setSelectedProduct(product);
    setFormData(
      product
        ? {
            name: product.name,
            price: product.price,
            stock: product.stock,
          }
        : { name: "", price: "", stock: "" }
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setFormData({ name: "", price: "", stock: "" });
    setModalOpen(false);
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Hapus produk "${product.name}"?`)) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/products/${product.product_id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Gagal menghapus produk");
      setProducts((prev) =>
        prev.filter((p) => p.product_id !== product.product_id)
      );
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus produk");
    }
  };

  const handleViewDetail = (product) => {
    navigate(`/admin/products/${product.product_id}`);
  };

  // Submit (add/edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = selectedProduct ? "PUT" : "POST";
      const url = selectedProduct
        ? `http://localhost:8080/api/products/${selectedProduct.product_id}`
        : "http://localhost:8080/api/products";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan produk");

      const updatedProduct = await res.json();

      if (selectedProduct) {
        // update existing product in list
        setProducts((prev) =>
          prev.map((p) =>
            p.product_id === updatedProduct.product_id ? updatedProduct : p
          )
        );
      } else {
        // add new product
        setProducts((prev) => [...prev, updatedProduct]);
      }

      closeModal();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan produk");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50">
      <NavbarAdmin />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Produk</h2>
          <button
            onClick={() => navigate('/admin/add-product')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white rounded-xl shadow"
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
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    Memuat data produk...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    Belum ada produk
                  </td>
                </tr>
              ) : (
                products.map((p, idx) => (
                  <tr
                    key={p.product_id}
                    className="border-b border-gray-100 hover:bg-pink-50 transition-colors"
                  >
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">Rp {Number(p.price).toLocaleString()}</td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        className="p-2 bg-white border-2 border-cyan-200 text-cyan-600 rounded-lg hover:bg-cyan-50 transition-all"
                        onClick={() => openModal(p)}
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {selectedProduct ? "Edit Produk" : "Tambah Produk"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border-2 border-pink-100 rounded-xl px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-1">Harga</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full border-2 border-pink-100 rounded-xl px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-1">Stok</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full border-2 border-pink-100 rounded-xl px-3 py-2"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 rounded-xl"
                    onClick={closeModal}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white rounded-xl"
                  >
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
