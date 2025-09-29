import React from 'react';

const ProductCard = ({ product, variant }) => {
  const bgColor = variant === 'least' ? 'bg-red-100' : 'bg-blue-100';
  return (
    <div className="text-center">
      <div className={`w-16 h-16 ${bgColor} rounded-lg mx-auto mb-2 flex items-center justify-center text-2xl`}>
        {product.image}
      </div>
      <h4 className="font-medium text-sm">{product.name}</h4>
      <p className="text-xs text-gray-500">Lorem ipsum dolor sit amet consectetur</p>
      <p className="text-sm font-bold">${product.price} usd</p>
    </div>
  );
};

export default ProductCard;
