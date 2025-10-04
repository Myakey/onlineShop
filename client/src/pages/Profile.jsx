import React, { useEffect, useState, useRef } from 'react';
import authService from '../services/authService';
import { User, Phone, MapPin, Edit2, Trash2, Plus, X, Check, Camera } from 'lucide-react';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");

    const [profileForm, setProfileForm] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: ''
    });

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

    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Table controls
    const [searchQuery, setSearchQuery] = useState('');
    const [sortKey, setSortKey] = useState('label');
    const [sortDir, setSortDir] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 6;

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
            
            const addrs = userData.addresses || [];
            setAddresses(addrs.map((a) => ({
                ...a,
                id: a.address_id || a.id || Math.random().toString(36).slice(2, 9)
            })));

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

    // Table utilities
    const filteredAddresses = addresses
        .filter((a) => {
            const q = searchQuery.trim().toLowerCase();
            if (!q) return true;
            return (
                (a.label || '').toLowerCase().includes(q) ||
                (a.recipient_name || '').toLowerCase().includes(q) ||
                (a.street_address || '').toLowerCase().includes(q) ||
                (a.city || '').toLowerCase().includes(q) ||
                (a.postal_code || '').toLowerCase().includes(q)
            );
        })
        .sort((x, y) => {
            const a = (x[sortKey] || '').toString().toLowerCase();
            const b = (y[sortKey] || '').toString().toLowerCase();
            if (a === b) return 0;
            if (sortDir === 'asc') return a < b ? -1 : 1;
            return a > b ? -1 : 1;
        });

    const totalPages = Math.max(1, Math.ceil(filteredAddresses.length / PAGE_SIZE));
    const currentPageItems = filteredAddresses.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const changeSort = (key) => {
        if (sortKey === key) {
            setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    if (isLoading && !user) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {message && (
                    <div className={`mb-6 p-5 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 ${
                        message.includes('successfully') 
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-2 border-green-300' 
                            : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-2 border-red-300'
                    }`}>
                        <div className="flex items-center gap-3">
                            {message.includes('successfully') ? (
                                <Check className="w-6 h-6 text-green-600" />
                            ) : (
                                <X className="w-6 h-6 text-red-600" />
                            )}
                            <span className="font-semibold">{message}</span>
                        </div>
                    </div>
                )}

                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

                {/* Top Section: Profile Picture + Edit Profile Side by Side */}
                <div className="grid lg:grid-cols-3 gap-8 mb-8">
                    {/* Left Column - Profile Picture */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-2xl p-5 text-center transform hover:shadow-3xl transition-all duration-300">
                            <div className="relative inline-block mb-6">
                                <div className="w-48 h-48 rounded-full overflow-hidden bg-white border-4 border-white shadow-2xl ring-4 ring-pink-200 mx-auto">
                                    {user?.profileImageUrl ? (
                                        <img
                                            src={`http://localhost:8080${user.profileImageUrl}`}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500 text-white text-6xl font-bold">
                                            {user?.firstName?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-3 rounded-full hover:from-pink-600 hover:to-rose-600 shadow-xl disabled:from-gray-400 disabled:to-gray-400 transition-all duration-300 hover:scale-110"
                                    >
                                        {isUploading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Camera className="w-5 h-5" />
                                        )}
                                    </button>
                                    {user?.profileImageUrl && (
                                        <button
                                            onClick={handleDeleteImage}
                                            disabled={isUploading}
                                            className="bg-gradient-to-r from-red-500 to-rose-600 text-white p-3 rounded-full hover:from-red-600 hover:to-rose-700 shadow-xl disabled:from-gray-400 disabled:to-gray-400 transition-all duration-300 hover:scale-110"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
                                {user?.firstName || user?.username}
                            </h1>
                            <p className="text-gray-600 mb-4">@{user?.username}</p>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 justify-center bg-pink-50 px-4 py-2 rounded-full">
                                    <User className="w-5 h-5 text-pink-600" />
                                    <span className="font-medium text-sm">@{user?.username}</span>
                                </div>
                                <div className="flex items-center gap-2 justify-center bg-rose-50 px-4 py-2 rounded-full">
                                    <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-medium text-sm">{user?.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Edit Profile Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 transform hover:shadow-3xl transition-all duration-300">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl">
                                    <Edit2 className="w-7 h-7 text-pink-600" />
                                </div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                                    Edit Profile Information
                                </h2>
                            </div>

                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-2xl border-2 border-pink-200 px-5 py-3.5 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                                            value={profileForm.firstName}
                                            onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-2xl border-2 border-pink-200 px-5 py-3.5 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                                            value={profileForm.lastName}
                                            onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <Phone className="w-5 h-5 text-pink-600" />
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        className="w-full rounded-2xl border-2 border-pink-200 px-5 py-3.5 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                                        value={profileForm.phoneNumber}
                                        onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                                        disabled={isLoading}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className={`w-full rounded-2xl py-4 text-white font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg ${isLoading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 hover:shadow-2xl'
                                        }`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : 'Save Profile'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Addresses Table (Full Width) */}
                <div className="bg-white w-full rounded-3xl shadow-2xl p-8 transform hover:shadow-3xl transition-all duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl">
                                <MapPin className="w-7 h-7 text-rose-600" />
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                                My Addresses
                            </h2>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="flex-1 md:flex-none">
                                <input
                                    placeholder="Search addresses..."
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                    className="w-full md:w-80 rounded-2xl border-2 border-pink-100 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-pink-50"
                                />
                            </div>
                            <button
                                onClick={() => openAddressModal()}
                                className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white px-6 py-3 rounded-2xl hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold"
                            >
                                <Plus className="w-5 h-5" />
                                Add
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-pink-50 to-rose-50 text-gray-700">
                                    <th className="py-3 px-4 text-left cursor-pointer font-bold" onClick={() => changeSort('label')}>
                                        Label {sortKey === 'label' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th className="py-3 px-4 text-left font-bold">Recipient</th>
                                    <th className="py-3 px-4 text-left font-bold">Phone</th>
                                    <th className="py-3 px-4 text-left font-bold">Address</th>
                                    <th className="py-3 px-4 text-left font-bold">City</th>
                                    <th className="py-3 px-4 text-left font-bold">Postal</th>
                                    <th className="py-3 px-4 text-left font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPageItems.map((address) => (
                                    <tr key={address.id || address.address_id} className="hover:bg-pink-50 transition border-b border-pink-100">
                                        <td className="py-4 px-4 align-top">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-800">{address.label}</span>
                                                {address.is_default && (
                                                    <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 align-top text-gray-700">{address.recipient_name}</td>
                                        <td className="py-4 px-4 align-top text-gray-700">{address.phone_number}</td>
                                        <td className="py-4 px-4 align-top leading-relaxed text-gray-700">
                                            {address.street_address}
                                            {address.district && <><br /><span className="text-sm text-gray-600">{address.district}</span></>}
                                        </td>
                                        <td className="py-4 px-4 align-top text-gray-700">{address.city}, {address.province}</td>
                                        <td className="py-4 px-4 align-top text-gray-700">{address.postal_code}</td>
                                        <td className="py-4 px-4 align-top">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openAddressModal(address)}
                                                    className="text-pink-600 hover:text-white hover:bg-pink-600 px-4 py-2 text-sm font-semibold border-2 border-pink-600 rounded-xl transition-all duration-300 flex items-center gap-2"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAddress(address.address_id || address.id)}
                                                    className="text-red-600 hover:text-white hover:bg-red-600 px-4 py-2 text-sm font-semibold border-2 border-red-600 rounded-xl transition-all duration-300 flex items-center gap-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredAddresses.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center py-12">
                                            <div className="bg-gradient-to-br from-pink-100 to-rose-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <MapPin className="w-10 h-10 text-pink-400" />
                                            </div>
                                            <p className="text-lg font-semibold text-gray-700 mb-1">No addresses found</p>
                                            <p className="text-gray-500 text-sm">Add your first address to get started</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {filteredAddresses.length > 0 && (
                        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-sm text-gray-600">
                                Showing {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, filteredAddresses.length)} of {filteredAddresses.length}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-2 rounded-lg font-medium transition ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border-2 border-pink-200 text-pink-600 hover:bg-pink-50'}`}
                                >
                                    First
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-2 rounded-lg font-medium transition ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border-2 border-pink-200 text-pink-600 hover:bg-pink-50'}`}
                                >
                                    Prev
                                </button>
                                <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold">
                                    {currentPage} / {totalPages}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-2 rounded-lg font-medium transition ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border-2 border-pink-200 text-pink-600 hover:bg-pink-50'}`}
                                >
                                    Next
                                </button>
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-2 rounded-lg font-medium transition ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border-2 border-pink-200 text-pink-600 hover:bg-pink-50'}`}
                                >
                                    Last
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Address Modal */}
                {isAddressModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                            <div className="sticky top-0 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white p-8 rounded-t-3xl">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-3xl font-bold flex items-center gap-3">
                                        <MapPin className="w-8 h-8" />
                                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                                    </h2>
                                    <button
                                        onClick={closeAddressModal}
                                        className="p-2.5 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-300"
                                    >
                                        <X className="w-7 h-7" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8">
                                <form onSubmit={handleAddressSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Address Label</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Home, Office, Parents House"
                                            className="w-full rounded-2xl border-2 border-pink-200 px-5 py-3.5 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                                            value={addressForm.label}
                                            onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Recipient Name</label>
                                            <input
                                                type="text"
                                                placeholder="Full name"
                                                className="w-full rounded-2xl border-2 border-pink-200 px-5 py-3.5 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                                                value={addressForm.recipientName}
                                                onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                placeholder="08xxxxxxxxxx"
                                                className="w-full rounded-2xl border-2 border-pink-200 px-5 py-3.5 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                                                value={addressForm.phoneNumber}
                                                onChange={(e) => setAddressForm({ ...addressForm, phoneNumber: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Street Address</label>
                                        <textarea
                                            placeholder="House number, street name, building name, etc."
                                            rows="3"
                                            className="w-full rounded-2xl border-2 border-pink-200 px-5 py-3.5 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300 resize-none"
                                            value={addressForm.streetAddress}
                                            onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Province</label>
                                            <select
                                                className="w-full rounded-2xl border-2 border-pink-200 px-5 py-3.5 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300"
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
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                                            <select
                                                className="w-full rounded-2xl border-2 border-pink-200 px-5 py-3.5 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300 disabled:bg-pink-50 disabled:cursor-not-allowed"
                                                value={addressForm.city}
                                                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
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
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">District (Optional)</label>
                                            <input
                                                type="text"
                                                placeholder="Kecamatan"
                                                className="w-full rounded-2xl border-2 border-pink-200 px-5 py-3.5 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                                                value={addressForm.district}
                                                onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Postal Code</label>
                                            <input
                                                type="text"
                                                placeholder="12345"
                                                className="w-full rounded-2xl border-2 border-pink-200 px-5 py-3.5 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                                                value={addressForm.postalCode}
                                                onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Additional Notes (Optional)</label>
                                        <textarea
                                            placeholder="Delivery instructions, landmarks, etc."
                                            rows="2"
                                            className="w-full rounded-2xl border-2 border-pink-200 px-5 py-3.5 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300 resize-none"
                                            value={addressForm.notes}
                                            onChange={(e) => setAddressForm({ ...addressForm, notes: e.target.value })}
                                        />
                                    </div>

                                    <label className="flex items-center space-x-3 p-5 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl cursor-pointer hover:from-pink-100 hover:to-rose-100 transition-all duration-300 border-2 border-pink-200">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-pink-300 text-pink-600 focus:ring-pink-500"
                                            checked={addressForm.isDefault}
                                            onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                        />
                                        <span className="text-sm font-bold text-gray-700">Set as default address</span>
                                    </label>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white py-4 rounded-2xl hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={closeAddressModal}
                                            className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-2xl hover:bg-gray-300 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
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