import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../components/layout/NavbarAdmin";
import { Edit3, Trash2, Eye, Plus } from "lucide-react";
import productService from "../services/productService";

const AdminProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Hapus produk "${product.name}"?`)) return;

    try {
      await productService.deleteProduct(product.product_id);
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

  const handleEditProduct = (product) => {
    navigate(`/admin/products/edit/${product.product_id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50">
      <NavbarAdmin />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Produk</h2>
          <button
            onClick={() => navigate("/admin/add-product")}
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
                      {/* Tombol edit langsung navigasi */}
                      <button
                        className="p-2 bg-white border-2 border-cyan-200 text-cyan-600 rounded-lg hover:bg-cyan-50 transition-all"
                        onClick={() => handleEditProduct(p)}
                      >
                        <Edit3 size={16} />
                      </button>

                      {/* Tombol hapus */}
                      <button
                        className="p-2 bg-white border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all"
                        onClick={() => handleDeleteProduct(p)}
                      >
                        <Trash2 size={16} />
                      </button>

                      {/* Tombol lihat detail */}
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
      </div>
    </div>
  );
};

export default AdminProduct;
