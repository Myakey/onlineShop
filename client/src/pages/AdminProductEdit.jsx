import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarAdmin from "../components/layout/NavbarAdmin";
import Footer from "../components/layout/Footer";
import { 
  Save, 
  Upload, 
  X, 
  Package, 
  Lock,
  AlertCircle,
  Image as ImageIcon,
  Star,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import productService from "../services/productService";
import reviewService from "../services/reviewService";

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
    images: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [message, setMessage] = useState("");
  const [hasReviews, setHasReviews] = useState(false);
  const [reviewStats, setReviewStats] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch product data and check reviews
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(productId);

        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          stock: data.stock || "",
          weight: data.weight || "",
          height: data.height || "",
          length: data.length || "",
          width: data.width || "",
          images: [],
        });

        // Set existing images as previews
        if (data.images && data.images.length > 0) {
          setImagePreviews(data.images.map(img => ({
            url: img.url || img.image_url,
            isExisting: true,
            cloudinary_id: img.product_img_id
          })));
        }

        // Check if product has reviews
        try {
          const reviewResponse = await reviewService.getProductReviewStats(productId);
          if (reviewResponse.success && reviewResponse.data) {
            setReviewStats(reviewResponse.data);
            setHasReviews(reviewResponse.data.total_reviews > 0);
          }
        } catch (reviewErr) {
          console.log("No reviews found for this product");
          setHasReviews(false);
        }
      } catch (err) {
        console.error("Fetch Product Error:", err);
        setMessage("Gagal mengambil data produk.");
        setTimeout(() => navigate("/admin/products"), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle multiple file selection (for new images)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 5;
    
    if (imagePreviews.length + files.length > maxImages) {
      setMessage(`Maksimal ${maxImages} gambar dapat diunggah`);
      setTimeout(() => setMessage(""), 3000);
      return;
    }

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

  // Mark image for deletion (but keep first image if has reviews)
  const markImageForDeletion = (index) => {
    if (hasReviews && index === 0) {
      alert("Gambar utama tidak dapat dihapus karena produk memiliki review!");
      return;
    }

    setImagePreviews(prev => {
      const newPreviews = [...prev];
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

  // Replace specific image
  const replaceImage = (index) => {
    if (hasReviews && index === 0) {
      alert("Gambar utama tidak dapat diganti karena produk memiliki review!");
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Remove old preview
      if (!imagePreviews[index].isExisting) {
        URL.revokeObjectURL(imagePreviews[index].url);
      }

      // Create new preview
      const newPreview = {
        url: URL.createObjectURL(file),
        file: file,
        isExisting: false
      };

      setImagePreviews(prev => {
        const newPreviews = [...prev];
        newPreviews[index] = newPreview;
        return newPreviews;
      });

      setFormData(prev => {
        const newImages = [...prev.images];
        newImages[index] = file;
        return { ...prev, images: newImages };
      });
    };
    input.click();
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === imagePreviews.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? imagePreviews.length - 1 : prev - 1
    );
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
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
      
      // Append new image files
      formData.images.forEach((file) => {
        form.append("image", file);
      });

      // Keep existing images
      const existingImages = imagePreviews
        .filter(img => img.isExisting)
        .map(img => img.cloudinary_id);
      console.log(imagePreviews);
      
      form.append("existingImages", JSON.stringify(existingImages));

      const res = await fetch(`${API_URL}/${productId}`, {
        method: "PUT",
        body: form,
      });

      if (!res.ok) {
        throw new Error("Failed to update product");
      }

      setMessage("Produk berhasil diperbarui!");
      
      setTimeout(() => {
        navigate(`/admin/products`);
      }, 1500);
    } catch (err) {
      console.error("Update Product Error:", err);
      setMessage("Gagal memperbarui produk. Pastikan semua data benar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-cyan-50 to-white flex flex-col">
        <NavbarAdmin />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            Memuat data produk...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const hasMultipleImages = imagePreviews.length > 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-cyan-50 to-white flex flex-col">
      <NavbarAdmin />
      
      <div className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Edit Produk</h1>
          <p className="text-gray-600">Perbarui informasi produk Anda</p>
        </div>

        {/* Review Warning */}
        {hasReviews && reviewStats && (
          <div className="mb-6 bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={24} />
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 mb-1">Produk Memiliki Review</h3>
              <p className="text-sm text-amber-800 mb-2">
                Produk ini memiliki {reviewStats.total_reviews} review dengan rating {reviewStats.average_rating.toFixed(1)}/5.0. 
                Beberapa field terkunci untuk menjaga integritas review.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Lock size={14} className="text-amber-600" />
                <span className="text-amber-700 font-semibold">
                  Terkunci: Nama, Deskripsi, Gambar Utama
                </span>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className={`mb-6 p-4 rounded-2xl font-semibold ${
            message.includes("berhasil") 
              ? "bg-green-50 text-green-700 border-2 border-green-200" 
              : "bg-red-50 text-red-700 border-2 border-red-200"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image Gallery */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-pink-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ImageIcon className="text-pink-500" />
                Galeri Produk
              </h2>

              {/* Main Image Display */}
              {imagePreviews.length > 0 && (
                <div className="relative mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-pink-50 to-cyan-50">
                  <div className="relative h-96 flex items-center justify-center p-4">
                    <img
                      src={imagePreviews[selectedImageIndex]?.url}
                      alt={`Product ${selectedImageIndex + 1}`}
                      className="w-full h-full object-contain transition-opacity duration-300"
                    />
                    
                    {hasReviews && selectedImageIndex === 0 && (
                      <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                        <Lock size={14} />
                        Terkunci
                      </div>
                    )}

                    <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {selectedImageIndex + 1} / {imagePreviews.length}
                    </div>

                    {hasMultipleImages && (
                      <>
                        <button
                          type="button"
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
                        >
                          <ChevronLeft size={24} className="text-gray-700" />
                        </button>
                        <button
                          type="button"
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
                        >
                          <ChevronRight size={24} className="text-gray-700" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Image Thumbnails */}
              {imagePreviews.length > 0 && (
  <div className="space-y-4">
    <div className="grid grid-cols-3 gap-3">
      {imagePreviews.map((preview, index) => (
        <div key={index} className="relative group">
          <div
            className={`relative w-full h-32 rounded-xl overflow-hidden transition-all cursor-pointer ${
              selectedImageIndex === index
                ? "ring-4 ring-pink-400 scale-105"
                : "ring-2 ring-gray-200 hover:ring-pink-300"
            }`}
            onClick={() => setSelectedImageIndex(index)}
          >
            <img
              src={preview.url}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Main Image Badge */}
            {index === 0 && (
              <div className="absolute bottom-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-lg font-semibold">
                Utama
              </div>
            )}

            {/* Existing Image Badge */}
            {preview.isExisting && (
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-lg font-semibold">
                Existing
              </div>
            )}

            {/* Locked Overlay */}
            {hasReviews && index === 0 && (
              <div className="absolute inset-0 bg-amber-900/30 flex items-center justify-center z-10">
                <Lock className="text-white" size={24} />
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute inset-x-0 bottom-2 flex gap-1 justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  replaceImage(index)
                }}
                disabled={hasReviews && index === 0}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ganti
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  markImageForDeletion(index)
                }}
                disabled={hasReviews && index === 0}
                className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <X size={12} />
                Hapus
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Upload More Button */}
    {imagePreviews.length < 5 && (
      <label className="block cursor-pointer border-2 border-dashed border-pink-300 rounded-xl p-4 text-center hover:border-cyan-400 hover:bg-pink-50 transition-all">
        <Upload className="w-6 h-6 mx-auto text-pink-400 mb-2" />
        <span className="text-sm text-gray-600 font-semibold">
          Tambah Gambar ({imagePreviews.length}/5)
        </span>
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
)}


              {imagePreviews.length === 0 && (
                <label className="block cursor-pointer border-2 border-dashed border-pink-200 rounded-xl p-12 text-center hover:border-cyan-400 transition-colors">
                  <Upload className="w-12 h-12 mx-auto text-pink-400 mb-3" />
                  <span className="text-lg text-gray-600 font-semibold block mb-1">
                    Upload Gambar Produk
                  </span>
                  <p className="text-sm text-gray-400">
                    Klik untuk upload (maksimal 5 gambar)
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
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-pink-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Informasi Dasar</h2>
              
              <div className="space-y-4">
                {/* Product Name */}
                <div className="relative">
                  <label className="block font-semibold text-gray-700 mb-2">
                    Nama Produk
                    {hasReviews && <Lock size={14} className="inline ml-2 text-amber-600" />}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={hasReviews}
                    className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none transition-colors ${
                      hasReviews 
                        ? "border-amber-200 bg-amber-50 cursor-not-allowed text-gray-500"
                        : "border-pink-100 focus:border-cyan-400"
                    }`}
                    placeholder="Contoh: Boneka Teddy Bear"
                    required
                  />
                </div>

                {/* Description */}
                <div className="relative">
                  <label className="block font-semibold text-gray-700 mb-2">
                    Deskripsi
                    {hasReviews && <Lock size={14} className="inline ml-2 text-amber-600" />}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={hasReviews}
                    className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none transition-colors ${
                      hasReviews 
                        ? "border-amber-200 bg-amber-50 cursor-not-allowed text-gray-500"
                        : "border-pink-100 focus:border-cyan-400"
                    }`}
                    placeholder="Deskripsi produk..."
                    rows="4"
                  />
                </div>

                {/* Price and Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">
                      Harga (Rp)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full border-2 border-pink-100 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">
                      Stok
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full border-2 border-pink-100 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Dimensions & Weight */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-pink-100">
              <div className="flex items-center gap-2 mb-6">
                <Package className="text-pink-500" size={24} />
                <h2 className="text-2xl font-bold text-gray-800">Dimensi & Berat</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">
                    Berat (gram)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full border-2 border-pink-100 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">
                    Panjang (cm)
                  </label>
                  <input
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full border-2 border-pink-100 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">
                    Lebar (cm)
                  </label>
                  <input
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full border-2 border-pink-100 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">
                    Tinggi (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full border-2 border-pink-100 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-4 italic">
                * Informasi dimensi dan berat diperlukan untuk perhitungan ongkos kirim
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-4 bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={20}/>
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default AdminProductEdit;