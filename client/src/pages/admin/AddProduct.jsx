import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarAdmin from "../../components/layout/NavbarAdmin";
import Footer from "../../components/layout/Footer";
import { Save, Upload, X } from "lucide-react";
import productService from "../../services/productService";

const API_URL = "http://localhost:8080/api/products";

export default function ProductForm() {
  const { id } = useParams(); // if id exists, it's edit mode
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const isEdit = Boolean(id);

  // Fetch product data if editing
  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const res = await productService.getProductById(id);
          const data = res.data;
          setFormData({
            name: data.name || "",
            description: data.description || "",
            price: data.price || "",
            stock: data.stock || "",
            image_url: data.image_url || "",
          });
          setImagePreview(data.image_url || null);
        } catch (err) {
          console.error(err);
          setMessage("Gagal memuat data produk.");
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image_url" && files?.[0]) {
      const file = files[0];
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      setFormData((prev) => ({ ...prev, image_url: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit form (add or edit)
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
      if (formData.image_url instanceof File) {
        form.append("image", formData.image_url);
      }

      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `${API_URL}/${id}` : API_URL;

      const res = await fetch(url, {
        method,
        body: form,
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/admin/products");
      }, 2000);

      setMessage(isEdit ? "Produk berhasil diperbarui!" : "Produk berhasil ditambahkan!");
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("Gagal menyimpan produk. Pastikan semua data benar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-cyan-50 to-white">
      <NavbarAdmin />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {isEdit ? "Edit Produk" : "Tambah Produk"}
        </h1>

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-pink-100 text-pink-700 font-semibold">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md p-6 rounded-2xl border-2 border-pink-100">
          {/* Nama Produk */}
          <div>
            <label className="block font-semibold mb-1">Nama Produk</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border-2 border-pink-100 rounded-xl px-3 py-2"
              placeholder="Contoh: Boneka Teddy Bear"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block font-semibold mb-1">Deskripsi</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border-2 border-pink-100 rounded-xl px-3 py-2"
              placeholder="Deskripsi produk..."
              rows="4"
            />
          </div>

          {/* Harga dan Stok */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Harga (Rp)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full border-2 border-pink-100 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Stok</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="w-full border-2 border-pink-100 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          {/* Gambar Produk */}
          <div>
            <label className="block font-semibold mb-2">Gambar Produk</label>
            {!imagePreview ? (
              <label className="block cursor-pointer border-2 border-dashed border-pink-200 rounded-xl p-6 text-center hover:border-cyan-400">
                <Upload className="w-8 h-8 mx-auto text-pink-400 mb-2" />
                <span className="text-sm text-gray-600">Klik untuk upload gambar</span>
                <input
                  type="file"
                  name="image_url"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChange}
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-xl border-2 border-pink-100"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Menyimpan..." : <><Save size={18}/> {isEdit ? "Perbarui Produk" : "Tambah Produk"}</>}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
