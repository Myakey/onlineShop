import React, { useState, useEffect } from "react";
import ProductCard from "../../components/products/ProductCard";

const mockProducts = [
  { product_id: 1, name: "Classic Burger", price: "$12.99", image: "/api/placeholder/300/200" },
  { product_id: 2, name: "Chicken Deluxe", price: "$14.99", image: "/api/placeholder/300/200" },
  { product_id: 3, name: "Veggie Burger", price: "$11.99", image: "/api/placeholder/300/200" },
];

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-8 py-16">
      <h1 className="text-3xl font-bold mb-8 text-center">All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
