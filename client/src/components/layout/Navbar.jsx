import { useState } from 'react';
import { Home, Package, Star, ShoppingCart, User, Search, X, LayoutDashboard, Plus, Settings, FileText } from 'lucide-react';

const Navbar = ({ currentPage = 'home', isAdmin = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPageState, setCurrentPageState] = useState(currentPage);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const toggleProfile = () => setShowProfile(prev => !prev);
  const clearSearch = () => setSearchQuery('');

  const getIcon = (key) => {
    const icons = {
      home: <Home className="w-8 h-8" />,
      products: <Package className="w-8 h-8" />,
      reviews: <Star className="w-8 h-8" />,
      order: <ShoppingCart className="w-8 h-8" />,
      dashboard: <LayoutDashboard className="w-8 h-8" />,
      orders: <FileText className="w-8 h-8" />,
      'add-product': <Plus className="w-8 h-8" />
    };
    return icons[key] || <Home className="w-8 h-8" />;
  };

  const navItems = isAdmin
    ? [
        { name: 'Dashboard', key: 'dashboard', path: '/admin', description: 'Kelola dashboard admin dan statistik' },
        { name: 'Products', key: 'products', path: '/products', description: 'Lihat dan kelola semua produk' },
        { name: 'Orders', key: 'orders', path: '/orders', description: 'Kelola pesanan pelanggan' },
        { name: 'Add Product', key: 'add-product', path: '/add-product', description: 'Tambahkan produk baru' }
      ]
    : [
        { name: 'Home', key: 'home', path: '/', description: 'Halaman utama toko kami dengan penawaran terbaik' },
        { name: 'Products', key: 'products', path: '/products', description: 'Jelajahi koleksi produk lengkap' },
        { name: 'Reviews', key: 'reviews', path: '/reviews', description: 'Baca review dan testimoni pelanggan' },
        { name: 'Order', key: 'order', path: '/order', description: 'Pesan makanan favorit Anda sekarang' }
      ];

  const handleNavClick = (path, key) => {
    setCurrentPageState(key);
    setIsMenuOpen(false);
    // In real implementation, use React Router navigation here
    console.log('Navigate to:', path);
  };

  return (
    <div className="relative">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 shadow-xl relative z-50">
        {/* Hamburger + Logo */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleMenu} 
            className="p-2 hover:bg-white/20 rounded-lg transition-all duration-300 transform hover:scale-110"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
              <div className={`h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </div>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <span className="text-white font-bold text-xl hidden md:block drop-shadow-lg">FoodStore</span>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-white/60" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-md text-white rounded-full placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300"
              placeholder="Cari produk, kategori..."
            />
            {searchQuery && (
              <button onClick={clearSearch} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <X className="h-5 w-5 text-white/60 hover:text-white transition-colors" />
              </button>
            )}
          </div>
        </div>

        {/* Cart & Profile */}
        <div className="flex items-center space-x-4">
          <button className="relative p-2 hover:bg-white/20 rounded-lg transition-all duration-300 transform hover:scale-110">
            <ShoppingCart className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">3</span>
          </button>

          {/* Profile */}
          <div className="relative">
            <div 
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all duration-300 transform hover:scale-110 shadow-lg z-50"
              onClick={toggleProfile}
            >
              <User className="w-5 h-5 text-white" />
            </div>

            {showProfile && (
              <>
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-100">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-white">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                        <User className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">John Doe</h3>
                        <p className="text-sm text-white/80">johndoe@example.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <button className="w-full text-left px-4 py-3 hover:bg-purple-50 rounded-xl transition-colors flex items-center space-x-3">
                      <User className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700 font-medium">Edit Profil</span>
                    </button>
                    <button className="w-full text-left px-4 py-3 hover:bg-purple-50 rounded-xl transition-colors flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700 font-medium">Pesanan Saya</span>
                    </button>
                    <button className="w-full text-left px-4 py-3 hover:bg-purple-50 rounded-xl transition-colors flex items-center space-x-3">
                      <Settings className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700 font-medium">Pengaturan</span>
                    </button>
                    <hr className="my-2 border-gray-200" />
                    <button className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium shadow-lg transform hover:scale-105">
                      Keluar
                    </button>
                  </div>
                </div>
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setShowProfile(false)}></div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hamburger Dropdown - Enhanced & Longer */}
      <div className={`absolute top-full left-0 right-0 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 shadow-2xl border-t-4 border-purple-500 transition-all duration-500 ease-in-out transform z-40 ${isMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-8 invisible'}`}>
        <div className="max-w-7xl mx-auto py-10 px-6">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              {isAdmin ? '🎯 Admin Control Panel' : '🍽️ Jelajahi Menu Kami'}
            </h2>
            <p className="text-gray-600 text-lg">Pilih kategori yang ingin Anda kunjungi</p>
          </div>
          
          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.path, item.key)}
                className={`group relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 ${currentPageState === item.key ? 'ring-4 ring-purple-500 scale-105' : ''}`}
              >
                {/* Animated Background */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-400/10 to-purple-400/10 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 shadow-lg ${
                    currentPageState === item.key 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white scale-110' 
                      : 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 group-hover:from-purple-500 group-hover:to-pink-500 group-hover:text-white group-hover:scale-110'
                  }`}>
                    {getIcon(item.key)}
                  </div>
                  
                  {/* Title */}
                  <h3 className={`font-bold text-2xl mb-3 transition-colors duration-300 ${
                    currentPageState === item.key ? 'text-purple-600' : 'text-gray-800 group-hover:text-purple-600'
                  }`}>
                    {item.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 min-h-[3rem]">
                    {item.description}
                  </p>
                  
                  {/* Active Indicator or Arrow */}
                  {currentPageState === item.key ? (
                    <div className="inline-flex items-center text-sm font-bold text-purple-600 bg-purple-100 px-4 py-2 rounded-full">
                      <span>✓ Halaman Aktif</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center text-sm font-semibold text-gray-400 group-hover:text-purple-600 transition-colors">
                      <span>Kunjungi</span>
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
          
          {/* Info Banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-6 bg-white rounded-2xl shadow-lg border-l-4 border-purple-500">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎉</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-1">Promo Spesial!</h3>
                  <p className="text-gray-600 text-sm">Dapatkan diskon hingga 50% untuk produk pilihan hari ini</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-white rounded-2xl shadow-lg border-l-4 border-pink-500">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-1">Gratis Ongkir!</h3>
                  <p className="text-gray-600 text-sm">Untuk pembelian minimal Rp 100.000 ke seluruh Indonesia</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom CTA Section */}
          <div className="p-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-white text-center md:text-left">
                <h3 className="font-bold text-2xl mb-2">Butuh Bantuan?</h3>
                <p className="text-white/90">Customer service kami siap membantu Anda 24/7</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                  <span>📞</span>
                  <span>Hubungi Kami</span>
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-xl font-bold hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2">
                  <span>💬</span>
                  <span>Live Chat</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;