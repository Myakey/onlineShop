import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarAdmin from "../components/layout/NavbarAdmin";
import Footer from "../components/layout/Footer";
import { Save, Package, ArrowLeft, Loader2 } from "lucide-react";
import productService from "../services/productService";

const API_URL = `${import.meta.env.VITE_API_URL}/api/products` || "http://localhost:8080/api/products";

const AdminProductEdit = () => {
  const navigate = useNavigate();
  const { productId } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    weight: "",
    height: "",
    length: "",
    width: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setFetching(true);
        const res = await productService.getProductById(productId);
        const data = res.data || res;

        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          stock: data.stock || "",
          weight: data.weight || "",
          height: data.height || "",
          length: data.length || "",
          width: data.width || "",
        });

        // Handle Image Previews (Read-Only)
        let existingImages = [];
        if (data.images && Array.isArray(data.images)) {
          existingImages = data.images.map((img) => ({
            url: img.url,
            isExisting: true,
            cloudinary_id: img.cloudinary_id,
          }));
        } else if (data.image_url) {
          existingImages = [
            {
              url: data.image_url,
              isExisting: true,
            },
          ];
        }
        setImagePreviews(existingImages);
      } catch (err) {
        console.error("Fetch Product Error:", err);
        setMessage("Gagal memuat data produk.");
      } finally {
        setFetching(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("price", formData.price);
      form.append("stock", formData.stock);
      form.append("weight", formData.weight || 0);
      form.append("height", formData.height || 0);
      form.append("length", formData.length || 0);
      form.append("width", formData.width || 0);

      // Images are NOT appended here, so they will not be updated.

      const res = await fetch(`${API_URL}/${productId}`, {
        method: "PUT",
        body: form,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      setMessage("Produk berhasil diperbarui!");
      
      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage("Gagal memperbarui produk.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-cyan-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-pink-500 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Memuat data produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-cyan-50 to-white">
      <NavbarAdmin />
      <main className="max-w-4xl mx-auto px-6 py-7">
        
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/admin/products')}
            className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Edit Produk
          </h1>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-4 p-4 rounded-xl font-semibold flex items-center gap-2 shadow-sm ${
            message.includes("berhasil") 
              ? "bg-green-100 text-green-700 border border-green-200" 
              : "bg-red-100 text-red-700 border border-red-200"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md p-6 rounded-2xl border-2 border-pink-100">
          
          {/* Section: Basic Info */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Nama Produk</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
              className="w-full border-2 border-pink-100 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 transition-all"
              placeholder="Contoh: Boneka Teddy Bear"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">Deskripsi</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full border-2 border-pink-100 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 transition-all"
              placeholder="Deskripsi produk..."
              rows="4"
            />
          </div>

          {/* Section: Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Harga (Rp)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                required
                min="0"
                className="w-full border-2 border-pink-100 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Stok</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                required
                min="0"
                className="w-full border-2 border-pink-100 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>
          </div>

          {/* Section: Dimensions & Weight */}
          <div className="border-t-2 border-pink-100 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="text-pink-500" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Dimensi & Berat Produk</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-sm text-gray-600">Berat (gram)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  min="0"
                  className="w-full border-2 border-pink-100 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block font-semibold mb-1 text-sm text-gray-600">Panjang (cm)</label>
                <input
                  type="number"
                  name="length"
                  value={formData.length}
                  onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
                  min="0"
                  className="w-full border-2 border-pink-100 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block font-semibold mb-1 text-sm text-gray-600">Lebar (cm)</label>
                <input
                  type="number"
                  name="width"
                  value={formData.width}
                  onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))}
                  min="0"
                  className="w-full border-2 border-pink-100 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block font-semibold mb-1 text-sm text-gray-600">Tinggi (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  min="0"
                  className="w-full border-2 border-pink-100 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Section: Images (Read-Only) */}
          <div>
            <label className="block font-semibold mb-2 text-gray-700">
              Gambar Produk
            </label>
            
            {imagePreviews.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-48 object-cover rounded-xl border-2 border-pink-100 shadow-sm"
                    />
                    {/* Removed X button for read-only mode */}
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-pink-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg font-semibold shadow-sm">
                        Utama
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
                <p className="text-gray-500 italic text-sm">Tidak ada gambar produk.</p>
            )}
            
            {/* Removed Upload Button */}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="w-1/3 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-3 bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Menyimpan...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>

        </form>
      </main>
      <Footer />
    </div>
  );
};

export default AdminProductEdit;