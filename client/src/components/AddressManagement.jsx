import { useState, useEffect } from 'react';
import authService from '../services/authService';

function AddressManagement() {
    const [addresses, setAddresses] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [message, setMessage] = useState('');
    
    const [formData, setFormData] = useState({
        label: '',
        recipientName: '',
        phoneNumber: '',
        streetAddress: '',
        province: '',
        city: '',
        district: '',
        postalCode: '',
        notes: '',
        isDefault: false
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [addressesResponse, provincesResponse] = await Promise.all([
                authService.getAddresses(),
                authService.getProvinces()
            ]);
            
            setAddresses(addressesResponse.addresses || []);
            setProvinces(provincesResponse.provinces || []);
        } catch (error) {
            console.error('Error loading data:', error);
            setMessage('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };

    const loadCities = async (provinceId) => {
        try {
            const response = await authService.getCities(provinceId);
            setCities(response.cities || []);
        } catch (error) {
            console.error('Error loading cities:', error);
        }
    };

    const handleProvinceChange = (provinceId) => {
        setFormData(prev => ({ ...prev, province: provinceId, city: '' }));
        if (provinceId) {
            loadCities(provinceId);
        } else {
            setCities([]);
        }
    };

    const openModal = (address = null) => {
        setEditingAddress(address);
        if (address) {
            setFormData({
                label: address.label,
                recipientName: address.recipient_name,
                phoneNumber: address.phone_number,
                streetAddress: address.street_address,
                province: address.province,
                city: address.city,
                district: address.district || '',
                postalCode: address.postal_code,
                notes: address.notes || '',
                isDefault: address.is_default
            });
            // Load cities for the selected province
            if (address.province) {
                loadCities(address.province);
            }
        } else {
            setFormData({
                label: '',
                recipientName: '',
                phoneNumber: '',
                streetAddress: '',
                province: '',
                city: '',
                district: '',
                postalCode: '',
                notes: '',
                isDefault: false
            });
        }
        setIsModalOpen(true);
        setMessage('');
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAddress(null);
        setCities([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (editingAddress) {
                await authService.updateAddress(editingAddress.address_id, formData);
                setMessage('Address updated successfully!');
            } else {
                await authService.addAddress(formData);
                setMessage('Address added successfully!');
            }
            
            closeModal();
            loadData();
        } catch (error) {
            console.error('Error saving address:', error);
            setMessage(error.response?.data?.error || 'Failed to save address');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (addressId) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        
        try {
            await authService.deleteAddress(addressId);
            setMessage('Address deleted successfully!');
            loadData();
        } catch (error) {
            console.error('Error deleting address:', error);
            setMessage(error.response?.data?.error || 'Failed to delete address');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">My Addresses</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Add New Address
                </button>
            </div>

            {message && (
                <div className={`mb-4 p-3 rounded-lg ${
                    message.includes('successfully') 
                        ? 'bg-green-100 text-green-700 border border-green-300' 
                        : 'bg-red-100 text-red-700 border border-red-300'
                }`}>
                    {message}
                </div>
            )}

            <div className="grid gap-4">
                {addresses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No addresses found. Add your first address to get started.</p>
                    </div>
                ) : (
                    addresses.map((address) => (
                        <div key={address.address_id} className="bg-white rounded-lg shadow-md p-6 border">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-lg font-semibold">{address.label}</h3>
                                        {address.is_default && (
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-700 font-medium">{address.recipient_name}</p>
                                    <p className="text-gray-600">{address.phone_number}</p>
                                    <p className="text-gray-600 mt-2">{address.street_address}</p>
                                    <p className="text-gray-600">
                                        {address.district && `${address.district}, `}
                                        {address.city}, {address.province} {address.postal_code}
                                    </p>
                                    {address.notes && (
                                        <p className="text-gray-500 text-sm mt-2 italic">
                                            Note: {address.notes}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => openModal(address)}
                                        className="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm border border-blue-600 rounded hover:bg-blue-50"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(address.address_id)}
                                        className="text-red-600 hover:text-red-800 px-3 py-1 text-sm border border-red-600 rounded hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4">
                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                            </h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Address Label (e.g., Home, Office)"
                                        className="col-span-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.label}
                                        onChange={(e) => setFormData({...formData, label: e.target.value})}
                                        required
                                    />
                                    
                                    <input
                                        type="text"
                                        placeholder="Recipient Name"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.recipientName}
                                        onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                                        required
                                    />
                                    
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                        required
                                    />
                                </div>
                                
                                <textarea
                                    placeholder="Street Address"
                                    rows="3"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={formData.streetAddress}
                                    onChange={(e) => setFormData({...formData, streetAddress: e.target.value})}
                                    required
                                />
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.province}
                                        onChange={(e) => handleProvinceChange(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Province</option>
                                        {provinces.map((province) => (
                                            <option key={province.province_id} value={province.province_id}>
                                                {province.province_name}
                                            </option>
                                        ))}
                                    </select>
                                    
                                    <select
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.city}
                                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                                        required
                                        disabled={!formData.province}
                                    >
                                        <option value="">Select City</option>
                                        {cities.map((city) => (
                                            <option key={city.city_id} value={city.city_name}>
                                                {city.city_type} {city.city_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="District (optional)"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.district}
                                        onChange={(e) => setFormData({...formData, district: e.target.value})}
                                    />
                                    
                                    <input
                                        type="text"
                                        placeholder="Postal Code"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.postalCode}
                                        onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                                        required
                                    />
                                </div>
                                
                                <textarea
                                    placeholder="Additional Notes (optional)"
                                    rows="2"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                />
                                
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={formData.isDefault}
                                        onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                                    />
                                    <span className="text-sm text-gray-700">Set as default address</span>
                                </label>
                                
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddressManagement;