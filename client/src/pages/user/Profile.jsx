import React, { useEffect, useState, useRef } from 'react';
import authService from '../../services/authService';
import { User, Phone, MapPin, Edit2, Trash2, Plus, X, Check, Camera } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import DefaultPFP from '../../assets/DefaultPFP.png'; 
import { useUser } from '../../context/userContext';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Profile() {
    // ✅ SECURITY FIX: Separate state for sensitive data (NOT stored in localStorage)
    const [user, setUser] = useState(null); // Full user data with email, phone, etc.
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");
    const { updateUserContext } = useUser();

    const [profileForm, setProfileForm] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: ''
    });

    const [addresses, setAddresses] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
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
        isDefault: false,
        latitude: null,
        longitude: null
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

    // ✅ SECURITY FIX: Fetch data but DON'T store sensitive info in localStorage
    const loadProfileData = async () => {
        try {
            const response = await authService.getProfile();
            const userData = response.user;

            // ✅ Keep full data in React state only (memory)
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

            // ✅ SECURITY FIX: Only store sanitized user data in localStorage
            const safeUserData = {
                id: userData.id,
                username: userData.username,
                type: userData.type,
                firstName: userData.firstName,
                lastName: userData.lastName,
                emailVerified: userData.emailVerified,
                profileImageUrl: userData.profileImageUrl, // Safe to store URL
                // ❌ DON'T store: email, phoneNumber, addresses
            };
            localStorage.setItem('user', JSON.stringify(safeUserData));
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

    const loadDistricts = async (cityId) => {
        try {
            const response = await authService.getDistricts(cityId);
            setDistricts(response.districts || []);
        } catch (error) {
            console.error('Failed to load districts:', error);
            return [];
        }
    }

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            await authService.updateProfile(profileForm);
            // ✅ Reload data to get updated info (stored securely)
            await loadProfileData();
            await updateUserContext();
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
            
            // ✅ SECURITY FIX: Update React state with new data
            setUser(response.user);
            
            // ✅ Update localStorage with sanitized data (includes profileImageUrl)
            const safeUserData = {
                id: response.user.id,
                username: response.user.username,
                type: response.user.type,
                firstName: response.user.firstName,
                lastName: response.user.lastName,
                emailVerified: response.user.emailVerified,
                profileImageUrl: response.user.profileImageUrl,
            };
            localStorage.setItem('user', JSON.stringify(safeUserData));
            await updateUserContext();
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
  if (!window.confirm('Are you sure you want to delete your profile picture?')) return;

  setIsUploading(true);
  setMessage('');

  try {
    const response = await fetch(DefaultPFP);
    const blob = await response.blob();

    const defaultFile = new File([blob], 'DefaultPFP.png', { type: blob.type });

    const formData = new FormData();
    formData.append('profileImage', defaultFile);

    const uploadResponse = await authService.uploadProfileImage(formData);

    const updatedUser = uploadResponse.user;
    setUser(updatedUser);

    const safeUserData = {
      id: updatedUser.id,
      username: updatedUser.username,
      type: updatedUser.type,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      emailVerified: updatedUser.emailVerified,
      profileImageUrl: updatedUser.profileImageUrl,
    };
    localStorage.setItem('user', JSON.stringify(safeUserData));

    await updateUserContext();

    setMessage('Profile picture successfully deleted!');
  } catch (error) {
    console.error('Failed to delete profile picture:', error);
    setMessage(error.response?.data?.error || 'Failed to delete profile picture');
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
                province: address.province_id,
                city: address.city_id,
                district: address.district_id,
                postalCode: address.postal_code,
                notes: address.notes || '',
                isDefault: address.is_default
            });
            if (address.province) {
                loadCities(address.province_id);
            }
            if (address.city){
                loadDistricts(address.city_id);
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

    function LocationMarker({ position, setPosition }) {
        const map = useMapEvents({
            click(e) {
            setPosition({
                lat: e.latlng.lat,
                lng: e.latlng.lng
            });
            },
        });

        return position ? <Marker position={[position.lat, position.lng]} /> : null;
    }

    // Location search component
function LocationSearch({ onLocationSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const provider = React.useMemo(() => new OpenStreetMapProvider(), []);

  const handleSearch = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await provider.search({ query });
      setSearchResults(results.slice(0, 5)); // Limit to 5 results
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (result) => {
    onLocationSelect({
      lat: result.y,
      lng: result.x,
      address: result.label
    });
    setSearchQuery(result.label);
    setShowResults(false);
    setSearchResults([]);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search location (e.g., Jakarta, Indonesia)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchResults.length > 0 && setShowResults(true)}
          className="w-full rounded-xl border-2 border-pink-200 pl-10 pr-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-pink-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((result, index) => (
            <button
              key={index}
              onClick={() => handleSelectLocation(result)}
              className="w-full text-left px-4 py-3 hover:bg-pink-50 transition-colors border-b border-pink-100 last:border-b-0"
            >
              <p className="text-sm font-medium text-gray-800 truncate">
                {result.label}
              </p>
            </button>
          ))}
        </div>
      )}

      {showResults && searchResults.length === 0 && searchQuery.length >= 3 && !isSearching && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-pink-200 rounded-xl shadow-lg">
          <p className="px-4 py-3 text-sm text-gray-500">No results found</p>
        </div>
      )}
    </div>
  );
}

// Component to handle map clicks
function MapClickHandler({ setPosition }) {
  useMap().on('click', (e) => {
    setPosition({
      lat: e.latlng.lat,
      lng: e.latlng.lng
    });
  });
  return null;
}

// Component to fly to location when coordinates change
function FlyToLocation({ position }) {
  const map = useMap();
  
  React.useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 15, {
        duration: 1.5
      });
    }
  }, [position, map]);
  
  return null;
}

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
            // ✅ Reload profile data (addresses stored in React state only)
            await loadProfileData();
        } catch (error) {
            console.error('Error saving address:', error);
            setMessage(error.response?.data?.error || 'Failed to save address');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;

        try {
            await authService.deleteAddress(addressId);
            setMessage('Address deleted successfully!');
            // ✅ Reload profile data
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
                (a.city?.city_name || '').toLowerCase().includes(q) ||
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
        <> 
            <Navbar />
        <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 py-6 sm:py-12 px-3 sm:px-4 pb-8 sm:pb-12">
            
            <div className="max-w-7xl mx-auto">
                {message && (
                    <div className={`mb-4 sm:mb-6 p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 ${
                        message.includes('successfully') 
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-2 border-green-300' 
                            : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-2 border-red-300'
                    }`}>
                        <div className="flex items-center gap-2 sm:gap-3">
                            {message.includes('successfully') ? (
                                <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                            ) : (
                                <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0" />
                            )}
                            <span className="font-semibold text-sm sm:text-base">{message}</span>
                        </div>
                    </div>
                )}

                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

                {/* Top Section: Profile Picture + Edit Profile Side by Side */}
                <div className="grid lg:grid-cols-3 gap-4 sm:gap-8 mb-4 sm:mb-8">
                    {/* Left Column - Profile Picture */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-5 text-center transform hover:shadow-3xl transition-all duration-300">
                            <div className="relative inline-block mb-4 sm:mb-6">
                                <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full overflow-hidden bg-white border-2 sm:border-4 border-white shadow-2xl ring-2 sm:ring-4 ring-pink-200 mx-auto">
                                    {user?.profileImageUrl ? (
                                        <img
                                            src={`${user.profileImageUrl}`}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500 text-white text-4xl sm:text-6xl font-bold">
                                            {user?.firstName?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-2 sm:p-3 rounded-full hover:from-pink-600 hover:to-rose-600 shadow-xl disabled:from-gray-400 disabled:to-gray-400 transition-all duration-300 hover:scale-110"
                                    >
                                        {isUploading ? (
                                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                                        )}
                                    </button>
                                    {user?.profileImageUrl && (
                                        <button
                                            onClick={handleDeleteImage}
                                            disabled={isUploading}
                                            className="bg-gradient-to-r from-red-500 to-rose-600 text-white p-2 sm:p-3 rounded-full hover:from-red-600 hover:to-rose-700 shadow-xl disabled:from-gray-400 disabled:to-gray-400 transition-all duration-300 hover:scale-110"
                                        >
                                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
                                {user?.firstName && user?.lastName 
                                    ? `${user.firstName} ${user.lastName}` 
                                    : user?.firstName || user?.username}
                            </h1>

                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center gap-2 justify-center bg-pink-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600 flex-shrink-0" />
                                    <span className="font-medium text-xs sm:text-sm truncate">@{user?.username}</span>
                                </div>
                                <div className="flex items-center gap-2 justify-center bg-rose-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-medium text-xs sm:text-sm truncate">{user?.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Edit Profile Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 transform hover:shadow-3xl transition-all duration-300">
                            <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
                                <div className="p-2 sm:p-3 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl sm:rounded-2xl flex-shrink-0">
                                    <Edit2 className="w-5 h-5 sm:w-7 sm:h-7 text-pink-600" />
                                </div>
                                <h2 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                                    Edit Profile Information
                                </h2>
                            </div>

                            <form onSubmit={handleProfileSubmit} className="space-y-4 sm:space-y-6">
                                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-1 sm:mb-2">First Name</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl sm:rounded-2xl border-2 border-pink-200 px-4 sm:px-5 py-2.5 sm:py-3.5 text-sm sm:text-base focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                                            value={profileForm.firstName}
                                            onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-1 sm:mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl sm:rounded-2xl border-2 border-pink-200 px-4 sm:px-5 py-2.5 sm:py-3.5 text-sm sm:text-base focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                                            value={profileForm.lastName}
                                            onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1 sm:mb-2 flex items-center gap-2">
                                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        className="w-full rounded-xl sm:rounded-2xl border-2 border-pink-200 px-4 sm:px-5 py-2.5 sm:py-3.5 text-sm sm:text-base focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                                        value={profileForm.phoneNumber}
                                        onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                                        disabled={isLoading}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className={`w-full rounded-xl sm:rounded-2xl py-3 sm:py-4 text-white font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg ${isLoading
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
                <div className="bg-white w-full rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 transform hover:shadow-3xl transition-all duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2 sm:p-3 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl sm:rounded-2xl flex-shrink-0">
                                <MapPin className="w-5 h-5 sm:w-7 sm:h-7 text-rose-600" />
                            </div>
                            <h2 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                                My Addresses
                            </h2>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
                            <div className="flex-1 md:flex-none">
                                <input
                                    placeholder="Search addresses..."
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                    className="w-full md:w-60 lg:w-80 rounded-xl sm:rounded-2xl border-2 border-pink-100 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-pink-50"
                                />
                            </div>
                            <button
                                onClick={() => openAddressModal()}
                                className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-1.5 sm:gap-2 font-semibold text-sm sm:text-base flex-shrink-0"
                            >
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="hidden sm:inline">Add</span>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block md:hidden space-y-3">
                        {currentPageItems.map((address) => (
                            <div key={address.id || address.address_id} className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 border-2 border-pink-100">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-gray-800 text-sm">{address.label}</span>
                                            {address.is_default && (
                                                <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm font-semibold text-gray-700">{address.recipient_name}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2 text-xs text-gray-600 mb-3">
                                    <div className="flex items-start gap-2">
                                        <Phone className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                        <span>{address.phone_number}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p>{address.street_address}</p>
                                            {address.district?.district_name && <p className="text-gray-500">{address.district.district_name}</p>}
                                            <p>{address.city?.city_name}, {address.province?.province_name}</p>
                                            <p>{address.postal_code}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2 border-t border-pink-200">
                                    <button
                                        onClick={() => openAddressModal(address)}
                                        className="flex-1 text-pink-600 hover:text-white hover:bg-pink-600 px-3 py-1.5 text-xs font-semibold border-2 border-pink-600 rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAddress(address.address_id || address.id)}
                                        className="flex-1 text-red-600 hover:text-white hover:bg-red-600 px-3 py-1.5 text-xs font-semibold border-2 border-red-600 rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredAddresses.length === 0 && (
                            <div className="text-center py-8">
                                <div className="bg-gradient-to-br from-pink-100 to-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <MapPin className="w-8 h-8 text-pink-400" />
                                </div>
                                <p className="text-base font-semibold text-gray-700 mb-1">No addresses found</p>
                                <p className="text-gray-500 text-sm">Add your first address to get started</p>
                            </div>
                        )}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-pink-50 to-rose-50 text-gray-700">
                                    <th className="py-3 px-4 text-left cursor-pointer font-bold text-sm" onClick={() => changeSort('label')}>
                                        Label {sortKey === 'label' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                    <th className="py-3 px-4 text-left font-bold text-sm">Recipient</th>
                                    <th className="py-3 px-4 text-left font-bold text-sm">Phone</th>
                                    <th className="py-3 px-4 text-left font-bold text-sm">Address</th>
                                    <th className="py-3 px-4 text-left font-bold text-sm">City</th>
                                    <th className="py-3 px-4 text-left font-bold text-sm">Postal</th>
                                    <th className="py-3 px-4 text-left font-bold text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPageItems.map((address) => (
                                    <tr key={address.id || address.address_id} className="hover:bg-pink-50 transition border-b border-pink-100">
                                        <td className="py-4 px-4 align-top">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-800 text-sm">{address.label}</span>
                                                {address.is_default && (
                                                    <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 align-top text-gray-700 text-sm">{address.recipient_name}</td>
                                        <td className="py-4 px-4 align-top text-gray-700 text-sm">{address.phone_number}</td>
                                        <td className="py-4 px-4 align-top leading-relaxed text-gray-700 text-sm">
                                            {address.street_address}
                                            {address.district?.district_name && <><br /><span className="text-xs text-gray-600">{address.district.district_name}</span></>}
                                        </td>
                                        <td className="py-4 px-4 align-top text-gray-700 text-sm">{address.city?.city_name}, {address.province?.province_name}</td>
                                        <td className="py-4 px-4 align-top text-gray-700 text-sm">{address.postal_code}</td>
                                        <td className="py-4 px-4 align-top">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openAddressModal(address)}
                                                    className="text-pink-600 hover:text-white hover:bg-pink-600 px-3 py-1.5 text-xs font-semibold border-2 border-pink-600 rounded-lg transition-all duration-300 flex items-center gap-1.5"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAddress(address.address_id || address.id)}
                                                    className="text-red-600 hover:text-white hover:bg-red-600 px-3 py-1.5 text-xs font-semibold border-2 border-red-600 rounded-lg transition-all duration-300 flex items-center gap-1.5"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
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
                        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                            <div className="text-xs sm:text-sm text-gray-600">
                                Showing {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, filteredAddresses.length)} of {filteredAddresses.length}
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium transition text-xs sm:text-sm ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border-2 border-pink-200 text-pink-600 hover:bg-pink-50'}`}
                                >
                                    First
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium transition text-xs sm:text-sm ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border-2 border-pink-200 text-pink-600 hover:bg-pink-50'}`}
                                >
                                    Prev
                                </button>
                                <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold text-xs sm:text-sm">
                                    {currentPage} / {totalPages}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium transition text-xs sm:text-sm ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border-2 border-pink-200 text-pink-600 hover:bg-pink-50'}`}
                                >
                                    Next
                                </button>
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium transition text-xs sm:text-sm ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border-2 border-pink-200 text-pink-600 hover:bg-pink-50'}`}
                                >
                                    Last
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Address Modal */}
                {isAddressModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
                        <div className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                            <div className="sticky top-0 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white p-5 sm:p-8 rounded-t-2xl sm:rounded-t-3xl z-10">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3">
                                        <MapPin className="w-6 h-6 sm:w-8 sm:h-8" />
                                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                                    </h2>
                                    <button
                                        onClick={closeAddressModal}
                                        className="p-2 sm:p-2.5 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-300 flex-shrink-0"
                                    >
                                        <X className="w-5 h-5 sm:w-7 sm:h-7" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-5 sm:p-8">
                                <form onSubmit={handleAddressSubmit} className="space-y-4 sm:space-y-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-1 sm:mb-2">Address Label</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Home, Office, Parents House"
                                            className="w-full rounded-xl sm:rounded-2xl border-2 border-pink-200 px-4 sm:px-5 py-2.5 sm:py-3.5 text-sm sm:text-base focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                                            value={addressForm.label}
                                            onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-1 sm:mb-2">Recipient Name</label>
                                            <input
                                                type="text"
                                                placeholder="Full name"
                                                className="w-full rounded-xl sm:rounded-2xl border-2 border-pink-200 px-4 sm:px-5 py-2.5 sm:py-3.5 text-sm sm:text-base focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                                                value={addressForm.recipientName}
                                                onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-1 sm:mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                placeholder="08xxxxxxxxxx"
                                                className="w-full rounded-xl sm:rounded-2xl border-2 border-pink-200 px-4 sm:px-5 py-2.5 sm:py-3.5 text-sm sm:text-base focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                                                value={addressForm.phoneNumber}
                                                onChange={(e) => setAddressForm({ ...addressForm, phoneNumber: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-1 sm:mb-2">Street Address</label>
                                        <textarea
                                            placeholder="House number, street name, building name, etc."
                                            rows="3"
                                            className="w-full rounded-xl sm:rounded-2xl border-2 border-pink-200 px-4 sm:px-5 py-2.5 sm:py-3.5 text-sm sm:text-base focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300 resize-none"
                                            value={addressForm.streetAddress}
                                            onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })}
                                            required
                                        />
                                    </div>

                                    {/* Map Location */}
                                    {/* ADD THIS SECTION AFTER STREET ADDRESS */}
                                    <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-700">
                                        Pin Location on Map (Optional)
                                    </label>
                                    
                                    {/* Search box - needs higher z-index */}
                                    <div className="relative z-[1000]">
                                        <LocationSearch
                                        onLocationSelect={(location) => {
                                            setAddressForm({
                                            ...addressForm,
                                            latitude: location.lat,
                                            longitude: location.lng
                                            });
                                        }}
                                        />
                                    </div>

                                    {/* Map */}
                                    <div className="rounded-xl sm:rounded-2xl overflow-hidden border-2 border-pink-200 relative z-0" style={{ height: '350px' }}>
                                        <MapContainer
                                        center={[
                                            addressForm.latitude ? parseFloat(addressForm.latitude) : -6.2088,
                                            addressForm.longitude ? parseFloat(addressForm.longitude) : 106.8456
                                        ]}
                                        zoom={13}
                                        style={{ height: '100%', width: '100%' }}
                                        scrollWheelZoom={true}
                                        zoomControl={true}
                                        >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            maxZoom={19}
                                        />
                                        <MapClickHandler
                                            setPosition={(pos) => {
                                            setAddressForm({
                                                ...addressForm,
                                                latitude: pos.lat,
                                                longitude: pos.lng
                                            });
                                            }}
                                        />
                                        {addressForm.latitude && addressForm.longitude && (
                                            <>
                                            <Marker position={[parseFloat(addressForm.latitude), parseFloat(addressForm.longitude)]} />
                                            <FlyToLocation position={{ lat: parseFloat(addressForm.latitude), lng: parseFloat(addressForm.longitude) }} />
                                            </>
                                        )}
                                        </MapContainer>
                                    </div>

                                    {/* Coordinates display and clear button */}
                                    <div className="flex items-center justify-between">
                                        {addressForm.latitude && addressForm.longitude ? (
                                        <>
                                            <p className="text-xs text-gray-600">
                                            📍 {parseFloat(addressForm.latitude).toFixed(6)}, {parseFloat(addressForm.longitude).toFixed(6)}
                                            </p>
                                            <button
                                            type="button"
                                            onClick={() => setAddressForm({ ...addressForm, latitude: null, longitude: null })}
                                            className="text-xs text-red-600 hover:text-red-700 font-semibold"
                                            >
                                            Clear Pin
                                            </button>
                                        </>
                                        ) : (
                                        <p className="text-xs text-gray-500 italic">
                                            Click on the map or search for a location to set coordinates
                                        </p>
                                        )}
                                    </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                                                Province
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter province"
                                                className="w-full rounded-xl sm:rounded-2xl border-2 border-pink-200 px-4 sm:px-5 py-2.5 sm:py-3.5 text-sm sm:text-base focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                                                value={addressForm.province}
                                                onChange={(e) =>
                                                    setAddressForm({ ...addressForm, province: e.target.value })
                                                }
                                                required
                                            />
                                        </div>


                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter city"
                                                className="w-full rounded-xl sm:rounded-2xl border-2 border-pink-200 px-4 sm:px-5 py-2.5 sm:py-3.5 text-sm sm:text-base focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                                                value={addressForm.city}
                                                onChange={(e) =>
                                                    setAddressForm({ ...addressForm, city: e.target.value })
                                                }
                                                required
                                            />
                                        </div>

                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
                                        <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                                                    District / Barangay
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter district or barangay"
                                                    className="w-full rounded-xl sm:rounded-2xl border-2 border-pink-200 px-4 sm:px-5 py-2.5 sm:py-3.5 text-sm sm:text-base focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                                                    value={addressForm.district}
                                                    onChange={(e) =>
                                                        setAddressForm({ ...addressForm, district: e.target.value })
                                                    }
                                                    required
                                                />
                                            </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-1 sm:mb-2">Postal Code</label>
                                            <input
                                                type="text"
                                                placeholder="12345"
                                                className="w-full rounded-xl sm:rounded-2xl border-2 border-pink-200 px-4 sm:px-5 py-2.5 sm:py-3.5 text-sm sm:text-base focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                                                value={addressForm.postalCode}
                                                onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-1 sm:mb-2">Additional Notes (Optional)</label>
                                        <textarea
                                            placeholder="Delivery instructions, landmarks, etc."
                                            rows="2"
                                            className="w-full rounded-xl sm:rounded-2xl border-2 border-pink-200 px-4 sm:px-5 py-2.5 sm:py-3.5 text-sm sm:text-base focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300 resize-none"
                                            value={addressForm.notes}
                                            onChange={(e) => setAddressForm({ ...addressForm, notes: e.target.value })}
                                        />
                                    </div>

                                    <label className="flex items-center space-x-3 p-4 sm:p-5 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl sm:rounded-2xl cursor-pointer hover:from-pink-100 hover:to-rose-100 transition-all duration-300 border-2 border-pink-200">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 sm:w-5 sm:h-5 rounded border-pink-300 text-pink-600 focus:ring-pink-500"
                                            checked={addressForm.isDefault}
                                            onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                        />
                                        <span className="text-xs sm:text-sm font-bold text-gray-700">Set as default address</span>
                                    </label>

                                    <div className="flex gap-3 sm:gap-4 pt-2 sm:pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 font-bold text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={closeAddressModal}
                                            className="flex-1 bg-gray-200 text-gray-700 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:bg-gray-300 font-bold text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
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
        </>
    );
}