import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

const ImageUpload = ({ image, setImage }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => setImage(null);

  return (
    <div
      className={`relative w-full h-80 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
        dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-100'
      }`}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
    >
      {image ? (
        <div className="relative w-full h-full">
          <img src={image} alt="Product preview" className="w-full h-full object-cover rounded-lg" />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="text-center text-gray-600">
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg mb-2">Drop your image here</p>
          <p className="text-sm mb-4">or</p>
          <label className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
            Browse Files
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
