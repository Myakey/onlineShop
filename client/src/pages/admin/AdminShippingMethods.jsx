import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Truck, Package, Clock, DollarSign, Loader2 } from 'lucide-react';
import shippingMethod from "../../services/shippingMethod";

// Mock service - replace with your actual service import
// import shippingMethodService from '../../services/shippingMethodService';

const AdminShippingMethods = () => {
  const [shippingMethods, setShippingMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    courier: '',
    base_cost: '',
    estimated_days: ''
  });

  useEffect(() => {
    loadShippingMethods();
  }, []);

  const loadShippingMethods = async () => {
    setIsLoading(true);
    try {
      const response = await shippingMethod.getAllShippingMethods();
      // Replace with: const response = await shippingMethodService.getAllShippingMethods();
      setShippingMethods(response.data || []);
    } catch (error) {
      alert('Failed to load shipping methods');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.courier || !formData.base_cost || !formData.estimated_days) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        courier: formData.courier,
        base_cost: Number(formData.base_cost),
        estimated_days: formData.estimated_days
      };
      
      const response = await shippingMethod.createShippingMethod(payload);
      // Replace with: const response = await shippingMethodService.createShippingMethod(payload);
      
      if (response.success) {
        await loadShippingMethods();
        setShowAddForm(false);
        resetForm();
        alert('Shipping method added successfully!');
      }
    } catch (error) {
      alert('Failed to add shipping method');
      console.error(error);
    }
  };

  const handleEdit = (method) => {
    setEditingId(method.id);
    setFormData({
      name: method.name,
      courier: method.courier,
      base_cost: method.base_cost.toString(),
      estimated_days: method.estimated_days
    });
  };

  const handleUpdate = async (id) => {
    try {
      const payload = {
        name: formData.name,
        courier: formData.courier,
        base_cost: Number(formData.base_cost),
        estimated_days: formData.estimated_days
      };
      
      const response = await shippingMethod.updateShippingMethod(id, payload);
      // Replace with: const response = await shippingMethodService.updateShippingMethod(id, payload);
      
      if (response.success) {
        await loadShippingMethods();
        setEditingId(null);
        resetForm();
        alert('Shipping method updated successfully!');
      }
    } catch (error) {
      alert('Failed to update shipping method');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shipping method?')) {
      return;
    }

    try {
      const response = await shippingMethod.deleteShippingMethod(id);
      // Replace with: const response = await shippingMethodService.deleteShippingMethod(id);
      
      if (response.success) {
        await loadShippingMethods();
        alert('Shipping method deleted successfully!');
      }
    } catch (error) {
      alert('Failed to delete shipping method');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      courier: '',
      base_cost: '',
      estimated_days: ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAddForm(false);
    resetForm();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-semibold">Loading shipping methods...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Shipping Methods</h1>
                <p className="text-gray-600 text-sm">Manage shipping options and pricing</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Method
            </button>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-pink-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-pink-500" />
              Add New Shipping Method
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Method Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., JNE Regular"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Courier *
                </label>
                <input
                  type="text"
                  name="courier"
                  value={formData.courier}
                  onChange={handleInputChange}
                  placeholder="e.g., JNE"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Base Cost (Rp) *
                </label>
                <input
                  type="number"
                  name="base_cost"
                  value={formData.base_cost}
                  onChange={handleInputChange}
                  placeholder="20000"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estimated Days *
                </label>
                <input
                  type="text"
                  name="estimated_days"
                  value={formData.estimated_days}
                  onChange={handleInputChange}
                  placeholder="e.g., 2-4 hari"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <Save className="w-5 h-5" />
                Save Method
              </button>
              <button
                onClick={cancelEdit}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Shipping Methods List */}
        <div className="space-y-4">
          {shippingMethods.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-semibold">No shipping methods found</p>
              <p className="text-gray-400 text-sm">Click "Add Method" to create your first shipping method</p>
            </div>
          ) : (
            shippingMethods.map((method) => (
              <div
                key={method.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                {editingId === method.id ? (
                  // Edit Mode
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Method Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Courier *
                        </label>
                        <input
                          type="text"
                          name="courier"
                          value={formData.courier}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Base Cost (Rp) *
                        </label>
                        <input
                          type="number"
                          name="base_cost"
                          value={formData.base_cost}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Estimated Days *
                        </label>
                        <input
                          type="text"
                          name="estimated_days"
                          value={formData.estimated_days}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => handleUpdate(method.id)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                      >
                        <Save className="w-5 h-5" />
                        Save Changes
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                      >
                        <X className="w-5 h-5" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg">
                          <Package className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{method.name}</h3>
                          <p className="text-sm text-gray-500">Courier: {method.courier}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="font-semibold">Rp {method.base_cost.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span>{method.estimated_days}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(method)}
                        className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(method.id)}
                        className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminShippingMethods;