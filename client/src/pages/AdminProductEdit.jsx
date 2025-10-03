import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavbarAdmin from '../components/layout/NavbarAdmin';

const AdminProductEdit = () => {
  const navigate = useNavigate();
  const { productId } = useParams();

  // Dummy data awal produk, biasanya ambil dari API
  const [product, setProduct] = useState({
    id: productId,
    name: '',
    price: '',
    stock: '',
    description: '',
    image: '',
  });

  // Simulasi fetch data produk
  useEffect(() => {
    // Misal fetch API: GET /products/:id
    setProduct({
      id: productId,
      name: 'Boneka Teddy Bear',
      price: 250000,
      stock: 10,
      description: 'Boneka teddy bear lucu ukuran sedang, cocok untuk hadiah.',
      image: 'https://placekitten.com/400/400',
    });
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulasi update produk via API PUT /products/:id
    alert('Produk berhasil diperbarui!');
    navigate(`/admin/products/${product.id}`);
  };

  return (
    <div>
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
