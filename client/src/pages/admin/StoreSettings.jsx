import React, { useEffect, useState } from "react";
import NavbarAdmin from "../../components/layout/NavbarAdmin";
import Footer from "../../components/layout/Footer";
import productService from "../../services/productService";

const StoreSettings = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Gagal memuat produk", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecommended = async (product) => {
    try {
      await productService.updateProduct(product.product_id, {
        is_recommended: product.is_recommended ? 0 : 1,
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.product_id === product.product_id
            ? { ...p, is_recommended: !p.is_recommended }
            : p
        )
      );
    } catch (err) {
      alert("Gagal mengubah status rekomendasi");
    }
  };

  return (
    <>
      <NavbarAdmin />

      <div className="min-h-screen p-10 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6">
          Store Settings – Produk Rekomendasi
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">Produk</th>
                  <th className="p-4 text-center">Harga</th>
                  <th className="p-4 text-center">Recommended</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.product_id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4 text-center">
                      Rp{" "}
                      {Number(product.price).toLocaleString("id-ID")}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleRecommended(product)}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                          product.is_recommended
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        {product.is_recommended ? "ON" : "OFF"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default StoreSettings;
