import { useState } from 'react';
import { Package, ShoppingCart, User, Search, X, LayoutDashboard, Plus, Settings, FileText } from 'lucide-react';

const NavbarAdmin = ({ currentPage = 'dashboard', onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPageState, setCurrentPageState] = useState(currentPage);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const toggleProfile = () => setShowProfile(prev => !prev);
  const clearSearch = () => setSearchQuery('');

  const getIcon = (key) => {
    const icons = {
      dashboard: <LayoutDashboard className="w-8 h-8" />,
      product: <Package className="w-8 h-8" />,
      orders: <FileText className="w-8 h-8" />,
      'add-product': <Plus className="w-8 h-8" />
    };
    return icons[key] || <LayoutDashboard className="w-8 h-8" />;
  };

  const navItems = [
    { name: 'Dashboard', key: 'dashboard', path: '/adminpage', description: 'Kelola dashboard admin dan statistik toko boneka' },
    { name: 'Product', key: 'product', path: '/product', description: 'Kelola semua koleksi boneka' },
    { name: 'Orders', key: 'orders', path: '/order', description: 'Kelola pesanan pembelian boneka' },
    { name: 'Add Product', key: 'add-product', path: '/add-product', description: 'Tambahkan boneka baru ke katalog' }
  ];

  const handleNavClick = (path, key) => {
    setCurrentPageState(key);
    setIsMenuOpen(false);
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className="relative">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-200 via-cyan-100 to-white shadow-md relative z-50">
        {/* Hamburger + Logo */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleMenu} 
            className="p-2 hover:bg-pink-100 rounded-lg transition-all duration-300 transform hover:scale-110"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
              <div className={`h-0.5 bg-pink-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`h-0.5 bg-pink-600 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`h-0.5 bg-pink-600 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </div>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center shadow-md">
              <span className="text-2xl">🧸</span>
            </div>
            <span className="text-pink-700 font-bold text-xl hidden md:block">TokoBoneka Admin</span>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-cyan-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-12 py-3 bg-white border border-cyan-200 text-pink-700 rounded-full placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-pink-400 transition-all duration-300"
              placeholder="Cari boneka favoritmu..."
            />
            {searchQuery && (
              <button onClick={clearSearch} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <X className="h-5 w-5 text-cyan-400 hover:text-pink-600 transition-colors" />
              </button>
            )}
          </div>
        </div>

        {/* Cart & Profile */}
        <div className="flex items-center space-x-4">
          <button className="relative p-2 hover:bg-cyan-100 rounded-lg transition-all duration-300 transform hover:scale-110">
            <ShoppingCart className="w-6 h-6 text-pink-600" />
            <span className="absolute -top-1 -right-1 bg-cyan-400 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow animate-pulse">3</span>
          </button>

          {/* Profile */}
          <div className="relative">
            <div 
              className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-cyan-200 transition-all duration-300 transform hover:scale-110 shadow-md z-50"
              onClick={toggleProfile}
            >
              <User className="w-5 h-5 text-pink-600" />
            </div>

            {showProfile && (
              <>
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-lg overflow-hidden z-50 border border-cyan-200">
                  <div className="bg-gradient-to-r from-pink-300 to-cyan-200 p-6 text-pink-800">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                        <User className="w-8 h-8 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Admin TokoBoneka</h3>
                        <p className="text-sm text-pink-700/80">admin@tokoboneka.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <button className="w-full text-left px-4 py-3 hover:bg-cyan-50 rounded-xl transition-colors flex items-center space-x-3">
                      <User className="w-5 h-5 text-cyan-500" />
                      <span className="text-gray-700 font-medium">Edit Profil</span>
                    </button>
                    <button className="w-full text-left px-4 py-3 hover:bg-cyan-50 rounded-xl transition-colors flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-cyan-500" />
                      <span className="text-gray-700 font-medium">Laporan Penjualan</span>
                    </button>
                    <button className="w-full text-left px-4 py-3 hover:bg-cyan-50 rounded-xl transition-colors flex items-center space-x-3">
                      <Settings className="w-5 h-5 text-cyan-500" />
                      <span className="text-gray-700 font-medium">Pengaturan</span>
                    </button>
                    <hr className="my-2 border-gray-200" />
                    <button className="w-full px-4 py-3 bg-gradient-to-r from-pink-400 to-cyan-400 text-white rounded-xl hover:from-pink-500 hover:to-cyan-500 transition-all duration-300 font-medium shadow-md transform hover:scale-105">
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

      {/* Hamburger Dropdown */}
      <div className={`absolute top-full left-0 right-0 bg-[#FFF5FA] shadow-xl border-t-4 border-pink-200 transition-all duration-500 ease-in-out transform z-40 ${isMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-8 invisible'}`}>
        <div className="max-w-7xl mx-auto py-10 px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent mb-3">
              🎯 Admin Control Panel
            </h2>
            <p className="text-gray-600 text-lg">Pilih kategori yang ingin kamu lihat</p>
          </div>
          
          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.path, item.key)}
                className={`group relative overflow-hidden rounded-3xl bg-white p-8 shadow-md hover:shadow-lg transition-all duration-500 transform hover:-translate-y-3 ${currentPageState === item.key ? 'ring-4 ring-cyan-300 scale-105' : ''}`}
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-100/40 to-cyan-100/30 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-100/30 to-pink-50/20 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="relative z-10">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 shadow-md ${
                    currentPageState === item.key 
                      ? 'bg-gradient-to-br from-pink-400 to-cyan-300 text-white scale-110' 
                      : 'bg-gradient-to-br from-pink-50 to-cyan-50 text-pink-500 group-hover:from-pink-400 group-hover:to-cyan-300 group-hover:text-white group-hover:scale-110'
                  }`}>
                    {getIcon(item.key)}
                  </div>
                  
                  <h3 className={`font-bold text-2xl mb-3 transition-colors duration-300 ${
                    currentPageState === item.key ? 'text-pink-600' : 'text-gray-800 group-hover:text-cyan-500'
                  }`}>
                    {item.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 min-h-[3rem]">
                    {item.description}
                  </p>
                  
                  {currentPageState === item.key ? (
                    <div className="inline-flex items-center text-sm font-bold text-cyan-600 bg-cyan-100 px-4 py-2 rounded-full">
                      <span>✓ Halaman Aktif</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center text-sm font-semibold text-gray-400 group-hover:text-cyan-500 transition-colors">
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
        </div>
      </div>
    </div>
  );
};

export default NavbarAdmin;