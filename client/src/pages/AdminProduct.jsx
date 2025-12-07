import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../components/layout/NavbarAdmin";
import { Edit3, Trash2, Eye, Plus, Package, Search, Filter } from "lucide-react";
import productService from "../services/productService";
import Footer from "../components/layout/Footer";


const AdminProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStock, setFilterStock] = useState("all"); // all, low, out

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

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStock = 
      filterStock === "all" ? true :
      filterStock === "low" ? p.stock > 0 && p.stock <= 10 :
      filterStock === "out" ? p.stock === 0 : true;
    return matchesSearch && matchesStock;
  });

  // Stock badge color
  const getStockBadge = (stock) => {
    if (stock === 0) return <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">Habis</span>;
    if (stock <= 10) return <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-xs font-semibold rounded-full">Rendah</span>;
    return <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">Tersedia</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 ">
      <NavbarAdmin />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                Manajemen Produk
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Package size={16} />
                Kelola semua produk di toko Anda
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/add-product")}
              className="group relative px-6 py-3 bg-pink-500 text-white rounded-xl font-medium overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-2">
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                Tambah Produk
              </div>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="all">Semua Stok</option>
                <option value="low">Stok Rendah (≤10)</option>
                <option value="out">Stok Habis</option>
              </select>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Produk</p>
                  <p className="text-2xl font-bold text-gray-800">{products.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Package className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Stok Rendah</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {products.filter(p => p.stock > 0 && p.stock <= 10).length}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Package className="text-yellow-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Stok Habis</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {products.filter(p => p.stock === 0).length}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <Package className="text-red-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Daftar Produk</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gradient-to-r from-pink-50 to-purple-50 border-b-2 border-pink-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">#</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Nama Produk</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Harga</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Stok</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-medium">Memuat data produk...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Package className="text-gray-300" size={48} />
                        <p className="text-gray-500 font-medium">
                          {searchTerm || filterStock !== "all" ? "Tidak ada produk yang sesuai filter" : "Belum ada produk"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p, idx) => (
                    <tr
                      key={p.product_id}
                      className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200"
                    >
                      <td className="px-6 py-4 text-gray-700 font-medium">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <span className="text-gray-800 font-semibold">{p.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700 font-medium">
                          Rp {Number(p.price).toLocaleString("id-ID")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700 font-semibold">{p.stock}</span>
                      </td>
                      <td className="px-6 py-4">
                        {getStockBadge(p.stock)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Tombol edit */}
                          <button
                            className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-110"
                            onClick={() => handleEditProduct(p)}
                            title="Edit Produk"
                          >
                            <Edit3 size={16} />
                          </button>

                          {/* Tombol hapus */}
                          <button
                            className="p-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-110"
                            onClick={() => handleDeleteProduct(p)}
                            title="Hapus Produk"
                          >
                            <Trash2 size={16} />
                          </button>

                          {/* Tombol lihat detail */}
                          <button
                            className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-110"
                            onClick={() => handleViewDetail(p)}
                            title="Lihat Detail"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Info */}
          {!loading && filteredProducts.length > 0 && (
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Menampilkan <span className="font-semibold text-gray-800">{filteredProducts.length}</span> dari{" "}
                <span className="font-semibold text-gray-800">{products.length}</span> produk
              </p>
            </div>
          )}
        </div>
      </div>
            <Footer />
    </div>
  );
};

export default AdminProduct;