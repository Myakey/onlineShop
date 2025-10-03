import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavbarAdmin from '../components/layout/NavbarAdmin';
import { Edit3, Trash2, ArrowLeft } from 'lucide-react';

const AdminProductDetail = () => {
  const navigate = useNavigate();
  const { productId } = useParams(); // ambil ID dari route

  // Dummy data produk
  const [product, setProduct] = useState({
    id: productId,
    name: 'Boneka Teddy Bear',
    price: 250000,
    stock: 10,
    description: 'Boneka teddy bear lucu ukuran sedang, cocok untuk hadiah.',
    image: 'https://placekitten.com/400/400',
  });

  // Fungsi hapus produk
  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      // panggil API hapus produk nanti
      alert('Produk berhasil dihapus!');
      navigate('/admin/products'); // kembali ke list produk
    }
  };

  // Fungsi edit produk → arah ke halaman AdminProductEdit
  const handleEdit = () => {
    navigate(`/admin/products/edit/${product.id}`); // route edit produk
  };

  return (
    <div>
      <NavbarAdmin />
      <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
        {/* Tombol kembali ke list produk */}
        <button 
          className="flex items-center gap-2 text-cyan-500 mb-6 hover:underline"
          onClick={() => navigate('/admin/products')}
        >
          <ArrowLeft className="w-5 h-5" /> Kembali ke Produk
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Gambar produk */}
          <div className="flex-shrink-0">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-64 h-64 object-cover rounded-xl shadow-md" 
            />
          </div>

          {/* Informasi produk */}
          <div className="flex-1 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-pink-600">{product.name}</h2>
            <p className="text-gray-700">{product.description}</p>
            <p className="text-lg font-semibold text-cyan-600">
              Harga: Rp {product.price.toLocaleString()}
            </p>
            <p className="text-gray-600">Stok: {product.stock} pcs</p>

            {/* Tombol aksi */}
            <div className="flex gap-4 mt-4">
              <button 
                onClick={handleEdit} // navigasi ke halaman edit
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
