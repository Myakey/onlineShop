import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarAdmin from "../../components/layout/NavbarAdmin";
import Footer from "../../components/layout/Footer";
import { Save, Upload, X, Package } from "lucide-react";
import productService from "../../services/productService";

const API_URL = `${import.meta.env.VITE_API_URL}/api/products` || "http://localhost:8080/api/products";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    images: [],
    weight: "",
    height: "",
    length: "",
    width: "",
  });

  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
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
            images: [],
            weight: data.weight || "",
            height: data.height || "",
            length: data.length || "",
            width: data.width || "",
          });
          
          // Set existing images as previews
          if (data.images && data.images.length > 0) {
            setImagePreviews(data.images.map(img => ({
              url: img.url,
              isExisting: true,
              cloudinary_id: img.cloudinary_id
            })));
          }
        } catch (err) {
          console.error(err);
          setMessage("Gagal memuat data produk.");
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  // Handle multiple file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 5;
    
    // Check if adding these files would exceed the limit
    if (imagePreviews.length + files.length > maxImages) {
      setMessage(`Maksimal ${maxImages} gambar dapat diunggah`);
      return;
    }

    // Create preview URLs for new files
    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      file: file,
      isExisting: false
    }));

    setImagePreviews(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  // Remove image from preview
  const removeImage = (index) => {
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      // Revoke object URL if it's a new file
      if (!newPreviews[index].isExisting) {
        URL.revokeObjectURL(newPreviews[index].url);
      }
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    setFormData(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
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
      form.append("weight", formData.weight || 0);
      form.append("height", formData.height || 0);
      form.append("length", formData.length || 0);
      form.append("width", formData.width || 0);
      
      // Append all image files
      formData.images.forEach((file) => {
        form.append("image", file);
      });

      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `${API_URL}/${id}` : API_URL;

      const res = await fetch(url, {
        method,
        body: form,
      });

      if (!res.ok) {
        throw new Error("Failed to save product");
      }

      setMessage(isEdit ? "Produk berhasil diperbarui!" : "Produk berhasil ditambahkan!");
      
      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);
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
      <main className="max-w-4xl mx-auto px-6 py-7">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {isEdit ? "Edit Produk" : "Tambah Produk"}
        </h1>

        {message && (
          <div className={`mb-4 p-3 rounded-xl font-semibold ${
            message.includes("berhasil") 
              ? "bg-green-100 text-green-700" 
              : "bg-pink-100 text-pink-700"
          }`}>
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
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="w-full border-2 border-pink-100 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400"
              placeholder="Contoh: Boneka Teddy Bear"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block font-semibold mb-1">Deskripsi</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border-2 border-pink-100 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400"
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
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                required
                min="0"
                step="0.01"
                className="w-full border-2 border-pink-100 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Stok</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                required
                min="0"
                className="w-full border-2 border-pink-100 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Dimensi & Berat Section */}
          <div className="border-t-2 border-pink-100 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="text-pink-500" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Dimensi & Berat Produk</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-sm">Berat (gram)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  min="0"
                  step="0.01"
                  className="w-full border-2 border-pink-100 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block font-semibold mb-1 text-sm">Panjang (cm)</label>
                <input
                  type="number"
                  name="length"
                  value={formData.length}
                  onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
                  min="0"
                  step="0.01"
                  className="w-full border-2 border-pink-100 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block font-semibold mb-1 text-sm">Lebar (cm)</label>
                <input
                  type="number"
                  name="width"
                  value={formData.width}
                  onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))}
                  min="0"
                  step="0.01"
                  className="w-full border-2 border-pink-100 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block font-semibold mb-1 text-sm">Tinggi (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  min="0"
                  step="0.01"
                  className="w-full border-2 border-pink-100 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400"
                  placeholder="0"
                />
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              * Informasi dimensi dan berat diperlukan untuk perhitungan ongkos kirim
            </p>
          </div>

          {/* Multiple Images */}
          <div>
            <label className="block font-semibold mb-2">
              Gambar Produk (Maksimal 5)
            </label>
            
            {/* Image Previews Grid */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-48 object-cover rounded-xl border-2 border-pink-100"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-lg font-semibold">
                        Utama
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {imagePreviews.length < 5 && (
              <label className="block cursor-pointer border-2 border-dashed border-pink-200 rounded-xl p-6 text-center hover:border-cyan-400 transition-colors">
                <Upload className="w-8 h-8 mx-auto text-pink-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Klik untuk upload gambar ({imagePreviews.length}/5)
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  Gambar pertama akan menjadi gambar utama
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              "Menyimpan..."
            ) : (
              <>
                <Save size={18}/>
                {isEdit ? "Perbarui Produk" : "Tambah Produk"}
              </>
            )}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}