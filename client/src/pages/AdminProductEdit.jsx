import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarAdmin from "../components/layout/NavbarAdmin";
import productService from "../services/productService";

const AdminProductEdit = () => {
  const navigate = useNavigate();
  const { productId } = useParams(); // ambil ID dari URL

  const [product, setProduct] = useState({
    id: "",
    name: "",
    price: "",
    stock: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch product asli dari API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(productId);

        setProduct({
          id: data.product_id,
          name: data.name || "",
          price: data.price || "",
          stock: data.stock || "",
          description: data.description || "",
          image: data.image_url || "",
        });
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

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Submit update produk
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await productService.updateProduct(product.id, {
        name: product.name,
        price: parseFloat(product.price),
        stock: parseInt(product.stock),
        description: product.description,
        image_url: product.image,
      });

      alert("Produk berhasil diperbarui!");
      navigate(`/admin/products/${product.id}`);
    } catch (err) {
      console.error("Update Product Error:", err);
      alert("Gagal memperbarui produk.");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 mt-16">
        Memuat data produk...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50">
      <NavbarAdmin />
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-pink-600 mb-6">Edit Produk</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-600 mb-1">Nama Produk</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full border-2 border-pink-100 rounded-xl px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Harga</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full border-2 border-pink-100 rounded-xl px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Stok</label>
            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              className="w-full border-2 border-pink-100 rounded-xl px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Deskripsi</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full border-2 border-pink-100 rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">URL Gambar</label>
            <input
              type="text"
              name="image"
              value={product.image}
              onChange={handleChange}
              className="w-full border-2 border-pink-100 rounded-xl px-3 py-2"
            />
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-40 h-40 object-cover mt-2 rounded-xl shadow-md"
              />
            )}
          </div>

          <div className="flex gap-4 mt-4">
            <button
              type="button"
              onClick={() => navigate(`/admin/products/${product.id}`)}
              className="px-4 py-2 bg-gray-200 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white rounded-xl"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductEdit;
