import React, { useState } from "react";
import { createProduct } from "../services/exampleService";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../components/layout/NavbarAdmin";
import Footer from "../components/layout/Footer";
import { 
  Package, 
  Upload, 
  DollarSign, 
  FileText, 
  Image as ImageIcon,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Box
} from "lucide-react";

function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    size: "",
    material: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const categories = [
    "Boneka Beruang",
    "Boneka Kelinci",
    "Boneka Kucing",
    "Boneka Anjing",
    "Boneka Karakter",
    "Boneka Custom",
    "Lainnya"
  ];

  const sizes = ["S (20-30cm)", "M (30-50cm)", "L (50-80cm)", "XL (80cm+)"];
  const materials = ["Katun", "Polyester", "Bulu Halus", "Silikon", "Mix Material"];

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await createProduct(formData);
      setMessage("Produk boneka berhasil ditambahkan!");
      setMessageType("success");

      // Clear the input after successful submission
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        size: "",
        material: "",
        image: null
      });
      setImagePreview(null);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/product");
      }, 2000);

      console.log("Product created:", response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Gagal menambahkan produk");
      setMessageType("error");
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name && formData.description && formData.price && formData.stock && formData.category;

  return (
    <div className="bg-gradient-to-br from-pink-50 via-cyan-50 to-white min-h-screen">
      <NavbarAdmin currentPage="add-product" />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-cyan-500 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-pink-500" />
            Tambah Produk Boneka Baru
          </h1>
          <p className="text-gray-600">Lengkapi informasi produk boneka untuk ditambahkan ke katalog</p>
        </div>

        {/* Alert Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-fade-in ${
            messageType === "success" 
              ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 text-green-700" 
              : "bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 text-red-700"
          }`}>
            {messageType === "success" ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <AlertCircle className="w-6 h-6" />
            )}
            <span className="font-semibold">{message}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Informasi Dasar */}
            <section className="bg-white rounded-3xl shadow-md p-6 border-2 border-pink-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-pink-500" />
                Informasi Dasar Produk
              </h2>

              <div className="space-y-5">
                {/* Nama Produk */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nama Produk Boneka <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="Contoh: Boneka Teddy Bear Pink Super Lucu"
                  />
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Deskripsi Produk <span className="text-pink-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                    placeholder="Jelaskan detail boneka ini... bahan, ukuran, keunggulan, dll."
                  />
                  <p className="text-sm text-gray-500 mt-1">Minimal 20 karakter, maksimal 500 karakter</p>
                </div>

                {/* Kategori & Size */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Kategori <span className="text-pink-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors bg-white"
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Ukuran
                    </label>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors bg-white"
                    >
                      <option value="">Pilih Ukuran</option>
                      {sizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Material */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Material / Bahan
                  </label>
                  <select
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors bg-white"
                  >
                    <option value="">Pilih Material</option>
                    {materials.map(material => (
                      <option key={material} value={material}>{material}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Harga & Stok */}
            <section className="bg-white rounded-3xl shadow-md p-6 border-2 border-pink-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-pink-500" />
                Harga & Stok
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Harga */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Harga (Rp) <span className="text-pink-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="1000"
                      className="w-full pl-12 pr-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors"
                      placeholder="50000"
                    />
                  </div>
                  {formData.price && (
                    <p className="text-sm text-cyan-600 mt-1 font-semibold">
                      {parseInt(formData.price).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                    </p>
                  )}
                </div>

                {/* Stok */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Jumlah Stok <span className="text-pink-500">*</span>
                  </label>
                  <div className="relative">
                    <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className="w-full pl-12 pr-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors"
                      placeholder="100"
                    />
                  </div>
                  {formData.stock && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.stock} unit tersedia
                    </p>
                  )}
                </div>
              </div>
            </section>

          </div>

          {/* Sidebar - Upload Image & Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Upload Gambar */}
              <section className="bg-white rounded-3xl shadow-md p-6 border-2 border-pink-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-pink-500" />
                  Foto Produk
                </h2>

                {!imagePreview ? (
                  <label className="block cursor-pointer">
                    <div className="border-3 border-dashed border-pink-300 rounded-2xl p-8 text-center hover:border-cyan-400 hover:bg-gradient-to-br hover:from-pink-50 hover:to-cyan-50 transition-all duration-300">
                      <Upload className="w-12 h-12 text-pink-400 mx-auto mb-3" />
                      <p className="font-bold text-gray-700 mb-1">Upload Foto Boneka</p>
                      <p className="text-sm text-gray-500">PNG, JPG hingga 5MB</p>
                    </div>
                    <input
                      type="file"
                      name="image"
                      onChange={handleChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-2xl border-2 border-pink-200 shadow-md"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-colors"></div>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-3 text-center">
                  Foto yang menarik akan meningkatkan penjualan! 📸
                </p>
              </section>

              {/* Form Summary */}
              <section className="bg-gradient-to-br from-pink-100 to-cyan-100 rounded-3xl shadow-md p-6 border-2 border-pink-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">📝 Ringkasan</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    {formData.name ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    )}
                    <span className="text-sm text-gray-700">Nama Produk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {formData.description ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    )}
                    <span className="text-sm text-gray-700">Deskripsi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {formData.category ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    )}
                    <span className="text-sm text-gray-700">Kategori</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {formData.price ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    )}
                    <span className="text-sm text-gray-700">Harga</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {formData.stock ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    )}
                    <span className="text-sm text-gray-700">Stok</span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading || !isFormValid}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-cyan-500 text-white rounded-2xl font-bold text-lg hover:from-pink-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Simpan Produk
                    </>
                  )}
                </button>

                {!isFormValid && (
                  <p className="text-xs text-gray-600 text-center mt-3">
                    * Lengkapi field yang wajib diisi
                  </p>
                )}
              </section>

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AddProduct;