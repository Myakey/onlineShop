import React, { useEffect, useState, useRef } from 'react';
import authService from '../services/authService';

export default function Profile() {
    // Profile data
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");
    
    // Profile form
    const [profileForm, setProfileForm] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: ''
    });
    
    // Address states
    const [addresses, setAddresses] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [addressForm, setAddressForm] = useState({
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
    
    // Image upload
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        loadProfileData();
        loadProvinces();
    }, []);

    const loadProfileData = async () => {
        try {
            const response = await authService.getProfile();
            const userData = response.user;
            
            setUser(userData);
            setProfileForm({
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                phoneNumber: userData.phoneNumber || ''
            });
            setAddresses(userData.addresses || []);
            
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('Failed to load profile:', error);
            setMessage('Failed to load profile data');
        } finally {
            setIsLoading(false);
        }
    };

    const loadProvinces = async () => {
        try {
            const response = await authService.getProvinces();
            setProvinces(response.provinces || []);
        } catch (error) {
            console.error('Failed to load provinces:', error);
        }
    };

    const loadCities = async (provinceId) => {
        try {
            const response = await authService.getCities(provinceId);
            setCities(response.cities || []);
        } catch (error) {
            console.error('Failed to load cities:', error);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            await authService.updateProfile(profileForm);
            await loadProfileData();
            setMessage('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            setMessage(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setMessage('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setMessage('File too large. Maximum size is 5MB');
            return;
        }

        setIsUploading(true);
        setMessage('');

        try {
            const formData = new FormData();
            formData.append('profileImage', file);

            const response = await authService.uploadProfileImage(formData);
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
            setMessage('Profile image updated successfully!');
        } catch (error) {
            console.error('Upload failed:', error);
            setMessage(error.response?.data?.error || 'Failed to upload image');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDeleteImage = async () => {
        if (!confirm('Are you sure you want to delete your profile picture?')) return;
        
        setIsUploading(true);
        try {
            await authService.deleteProfileImage();
            const updatedUser = { ...user, profileImageUrl: null };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setMessage('Profile image deleted successfully!');
        } catch (error) {
            setMessage('Failed to delete profile image');
        } finally {
            setIsUploading(false);
        }
    };

    const openAddressModal = (address = null) => {
        setEditingAddress(address);
        if (address) {
            setAddressForm({
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
            if (address.province) {
                loadCities(address.province);
            }
        } else {
            setAddressForm({
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
        setIsAddressModalOpen(true);
        setMessage('');
    };

    const closeAddressModal = () => {
        setIsAddressModalOpen(false);
        setEditingAddress(null);
        setCities([]);
    };

    const handleProvinceChange = (provinceId) => {
        setAddressForm(prev => ({ ...prev, province: provinceId, city: '' }));
        if (provinceId) {
            loadCities(provinceId);
        } else {
            setCities([]);
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (editingAddress) {
                await authService.updateAddress(editingAddress.address_id, addressForm);
                setMessage('Address updated successfully!');
            } else {
                await authService.addAddress(addressForm);
                setMessage('Address added successfully!');
            }
            
            closeAddressModal();
            await loadProfileData();
        } catch (error) {
            console.error('Error saving address:', error);
            setMessage(error.response?.data?.error || 'Failed to save address');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        
        try {
            await authService.deleteAddress(addressId);
            setMessage('Address deleted successfully!');
            await loadProfileData();
        } catch (error) {
            console.error('Error deleting address:', error);
            setMessage(error.response?.data?.error || 'Failed to delete address');
        }
    };

    if (isLoading && !user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {message && (
                    <div className={`mb-4 p-4 rounded-lg ${
                        message.includes('successfully') 
                            ? 'bg-green-100 text-green-700 border border-green-300' 
                            : 'bg-red-100 text-red-700 border border-red-300'
                    }`}>
                        {message}
                    </div>
                )}

                {/* Profile Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h1>
                    
                    {/* Profile Image */}
                    <div className="flex items-center space-x-6 mb-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                                {user?.profileImageUrl ? (
                                    <img
                                        src={`http://localhost:8080${user.profileImageUrl}`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                                        {user?.firstName?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-lg disabled:bg-gray-400"
                            >
                                {isUploading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                            {user?.profileImageUrl && (
                                <button
                                    onClick={handleDeleteImage}
                                    disabled={isUploading}
                                    className="absolute -bottom-1 -left-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 shadow-lg disabled:bg-gray-400"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Username: <strong>{user?.username}</strong></p>
                            <p className="text-sm text-gray-600">Email: <strong>{user?.email}</strong></p>
                        </div>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />

                    {/* Profile Form */}
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={profileForm.firstName}
                                    onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={profileForm.lastName}
                                    onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={profileForm.phoneNumber}
                                onChange={(e) => setProfileForm({...profileForm, phoneNumber: e.target.value})}
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            className={`w-full rounded-lg py-2 text-white transition-colors ${
                                isLoading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </form>
                </div>

                {/* Addresses Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">My Addresses</h2>
                        <button
                            onClick={() => openAddressModal()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Add Address
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {addresses.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>No addresses found. Add your first address.</p>
                            </div>
                        ) : (
                            addresses.map((address) => (
                                <div key={address.address_id} className="border rounded-lg p-4">
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
                                                <p className="text-gray-500 text-sm mt-2 italic">Note: {address.notes}</p>
                                            )}
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={() => openAddressModal(address)}
                                                className="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm border border-blue-600 rounded hover:bg-blue-50"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAddress(address.address_id)}
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
                </div>

                {/* Address Modal */}
                {isAddressModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <h2 className="text-xl font-bold mb-4">
                                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                                </h2>
                                
                                <form onSubmit={handleAddressSubmit} className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Address Label (e.g., Home, Office)"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={addressForm.label}
                                        onChange={(e) => setAddressForm({...addressForm, label: e.target.value})}
                                        required
                                    />
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Recipient Name"
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            value={addressForm.recipientName}
                                            onChange={(e) => setAddressForm({...addressForm, recipientName: e.target.value})}
                                            required
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Phone Number"
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            value={addressForm.phoneNumber}
                                            onChange={(e) => setAddressForm({...addressForm, phoneNumber: e.target.value})}
                                            required
                                        />
                                    </div>
                                    
                                    <textarea
                                        placeholder="Street Address"
                                        rows="3"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={addressForm.streetAddress}
                                        onChange={(e) => setAddressForm({...addressForm, streetAddress: e.target.value})}
                                        required
                                    />
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <select
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            value={addressForm.province}
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
                                            value={addressForm.city}
                                            onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                                            required
                                            disabled={!addressForm.province}
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
                                            value={addressForm.district}
                                            onChange={(e) => setAddressForm({...addressForm, district: e.target.value})}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Postal Code"
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            value={addressForm.postalCode}
                                            onChange={(e) => setAddressForm({...addressForm, postalCode: e.target.value})}
                                            required
                                        />
                                    </div>
                                    
                                    <textarea
                                        placeholder="Additional Notes (optional)"
                                        rows="2"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={addressForm.notes}
                                        onChange={(e) => setAddressForm({...addressForm, notes: e.target.value})}
                                    />
                                    
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={addressForm.isDefault}
                                            onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
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
                                            onClick={closeAddressModal}
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
        </div>
    );
}