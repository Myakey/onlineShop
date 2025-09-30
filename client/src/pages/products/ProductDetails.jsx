import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams(); // ambil id dari URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Simulasi fetch product dari API
    const fetchProduct = async () => {
      // Contoh data dummy
      const mockProduct = {
        id,
        name: `Product ${id}`,
        price: `$${(10 + Number(id)).toFixed(2)}`,
        description: `This is a detailed description for product ${id}.`,
        image: `/api/placeholder/400/300`,
      };
      setProduct(mockProduct);
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div className="text-white text-center mt-16">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white px-8 py-16">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-80 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-green-400 font-bold text-xl mb-4">{product.price}</p>
          <p className="text-gray-300 mb-6">{product.description}</p>
          <button className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
