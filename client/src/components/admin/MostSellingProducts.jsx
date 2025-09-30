import React from 'react';
import ProductCard from './ProductCard';

const MostSellingProducts = ({ products }) => (
  <div className="bg-white text-gray-800 rounded-lg p-6">
    <h3 className="font-medium text-gray-600 mb-4">Most Selling Products</h3>
    <div className="grid grid-cols-2 gap-4">
      {products.map(product => <ProductCard key={product.id} product={product} />)}
    </div>
  </div>
);

export default MostSellingProducts;
