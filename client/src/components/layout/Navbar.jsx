import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ currentPage = 'home', isAdmin = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPageState, setCurrentPageState] = useState(currentPage);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const toggleProfile = () => setShowProfile(prev => !prev);
  const clearSearch = () => setSearchQuery('');

  const navItems = isAdmin
    ? [
        { name: 'Dashboard', key: 'dashboard', path: '/admin' },       // halaman admin.jsx
        { name: 'Products', key: 'products', path: '/products' },     // ProductList.jsx
        { name: 'Orders', key: 'orders', path: '/orders' },           // buat halaman orders.jsx kalau perlu
        { name: 'Add Product', key: 'add-product', path: '/add-product' } // AddProduct.jsx
      ]
    : [
        { name: 'Home', key: 'home', path: '/', description: 'Halaman utama' },       // Home.jsx / Homedefault.jsx
        { name: 'Products', key: 'products', path: '/products', description: 'Lihat produk' }, // ProductList.jsx
        { name: 'Reviews', key: 'reviews', path: '/reviews', description: 'Baca review' },   // AdminReviews.jsx atau buat Review.jsx
        { name: 'Order', key: 'order', path: '/order', description: 'Pesan makanan' }      // buat Order.jsx
      ];

  return (
    <div className="relative">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm relative z-50">
        {/* Hamburger + Logo */}
        <div className="flex items-center space-x-4">
          <button onClick={toggleMenu} className="p-2 hover:bg-gray-100 rounded-md transition-colors">
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className={`h-0.5 bg-black transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`h-0.5 bg-black transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`h-0.5 bg-black transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </div>
          </button>
          <div className="w-8 h-8 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 bg-gray-900 text-white rounded-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Cart & Profile */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h10M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">1</span>
          </div>

          {/* Profile */}
          <div className="relative">
            <div 
              className="w-8 h-8 bg-black rounded-full flex items-center justify-center cursor-pointer z-50"
              onClick={toggleProfile}
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>

            {showProfile && (
              <>
                <div className="absolute right-0 mt-2 w-64 bg-white text-black p-4 rounded shadow-lg z-50">
                  <h3 className="font-bold mb-2">Profil Saya</h3>
                  <p>Username: johndoe</p>
                  <p>Email: johndoe@example.com</p>
                  <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded">Edit Profil</button>
                </div>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)}></div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hamburger Dropdown */}
      <div className={`absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 transition-all duration-300 ease-in-out transform z-40 ${isMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-0">
            {navItems.map(item => (
              <Link
                key={item.key}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full text-left p-6 hover:bg-gray-50 transition-colors border-b border-gray-100 md:border-r md:border-b-0 md:last:border-r-0 ${currentPageState === item.key ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span>{item.name[0]}</span>
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${currentPageState === item.key ? 'text-blue-600' : 'text-gray-800'}`}>{item.name}</h3>
                    {item.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
