//INI CUMA TEMPLATE DARI AI BUAT COBA YAAAAAA!!!!!!!
import React, { useState } from "react";
import { createProduct } from "../services/exampleService";
import { useNavigate } from "react-router-dom";

function AddProduct() {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      } else {
        setImagePreview(null);
      }
    } else{
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await createProduct(formData);
      setMessage("Product added successfully!");
      setMessageType("success");

      // Clear the input after successful submission
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: null
      });
      setImagePreview(null);

      navigate("/"); // Redirect to home page after adding product

      console.log("Product created:", response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error adding product");
      setMessageType("error");
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Add New Product
            </h1>

            {message && (
                <div className={`mb-4 p-3 rounded ${
                    messageType === "success" 
                        ? "bg-green-100 text-green-700 border border-green-300" 
                        : "bg-red-100 text-red-700 border border-red-300"
                }`}>
                    {message}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter product name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter product description"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($)
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Quantity
                    </label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Image
                    </label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                        accept="image/*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {imagePreview && (
                        <div className="mt-3">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-md border border-gray-300"
                            />
                        </div>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading || !formData.name || !formData.description || !formData.price || !formData.stock}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                    {loading ? "Adding Product..." : "Add Product"}
                </button>
            </div>
        </div>
    );
}

export default AddProduct;
