import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarAdmin from "../components/layout/NavbarAdmin";
import { Edit3, Trash2, ArrowLeft } from "lucide-react";
import productService from "../services/productService";

const AdminProductDetail = () => {
  const navigate = useNavigate();
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product dari API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(productId);
        setProduct(data); // pastikan service return data lengkap termasuk image_url
      } catch (err) {
        console.error("Fetch Product Error:", err);
        alert("Gagal mengambil data produk.");
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  // Fungsi hapus produk
  const handleDelete = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;

    try {
      await productService.deleteProduct(productId);
      alert("Produk berhasil dihapus!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Delete Product Error:", err);
      alert("Gagal menghapus produk.");
    }
  };

  // Fungsi edit produk
  const handleEdit = () => {
    navigate(`/admin/products/edit/${productId}`);
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 mt-16">
        Memuat data produk...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center text-red-500 mt-16">
        Produk tidak ditemukan
      </div>
    );
  }

  // Gunakan Cloudinary URL langsung jika ada, else placeholder
  const imageUrl = product.image_url || "https://via.placeholder.com/400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50">
      <NavbarAdmin />
      <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
        {/* Tombol kembali ke list produk */}
        <button
          className="flex items-center gap-2 text-cyan-500 mb-6 hover:underline"
          onClick={() => navigate("/admin/products")}
        >
          <ArrowLeft className="w-5 h-5" /> Kembali ke Produk
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Gambar produk */}
          <div className="flex-shrink-0">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-64 h-64 object-cover rounded-xl shadow-md"
            />
          </div>

          {/* Informasi produk */}
          <div className="flex-1 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-pink-600">{product.name}</h2>
            <p className="text-gray-700">{product.description || "-"}</p>
            <p className="text-lg font-semibold text-cyan-600">
              Harga: Rp {Number(product.price).toLocaleString()}
            </p>
            <p className="text-gray-600">Stok: {product.stock} pcs</p>

            {/* Tombol aksi */}
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-400 to-cyan-400 text-white rounded-xl hover:from-pink-500 hover:to-cyan-500 transition-all"
              >
                <Edit3 className="w-4 h-4" /> Edit Produk
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
              >
                <Trash2 className="w-4 h-4" /> Hapus Produk
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetail;
