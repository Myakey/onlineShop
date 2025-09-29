import React, { useState } from 'react';
import AdminHeader from '../admin/AdminHeader';
import ImageUpload from '../forms/ImageUpload';
import ProductForm from '../forms/ProductForm';

const AdminAddProduct = () => {
  const [image, setImage] = useState(null);

  const handleSubmit = (formData) => {
    console.log('Product Data:', formData);
    console.log('Image:', image);
    alert('Product added successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader />
      <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ImageUpload image={image} setImage={setImage} />
        <ProductForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default AdminAddProduct;
