import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Package, FileText, Plus, LayoutDashboard, Menu, Search, X, ShoppingCart, User, Settings 
} from 'lucide-react';

const NavbarAdmin = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const location = useLocation(); // untuk menandai menu aktif
  const currentPath = location.pathname;

  const navItems = [
  { name: 'Dashboard', key: 'dashboard', path: '/admin-dashboard', icon: <LayoutDashboard className="w-6 h-6" /> },
  { name: 'Product', key: 'product', path: '/admin/products', icon: <Package className="w-6 h-6" /> }, // ubah path
  { name: 'Orders', key: 'orders', path: '/admin/orders', icon: <FileText className="w-6 h-6" /> },
  { name: 'Add Product', key: 'add-product', path: '/admin/add-product', icon: <Plus className="w-6 h-6" /> },
];


  const handleNavClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-200 via-cyan-100 to-white shadow-md">
        {/* Hamburger + Logo */}
        <div className="flex items-center space-x-4">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-pink-100 rounded-lg">
            <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
              <div className={`h-0.5 bg-pink-600 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`h-0.5 bg-pink-600 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`h-0.5 bg-pink-600 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
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
        <div className="flex-1 max-w-2xl mx-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari boneka..."
            className="w-full pl-12 pr-12 py-2 rounded-full border border-cyan-200 text-pink-700 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-5 h-5 text-cyan-400 hover:text-pink-600" />
            </button>
          )}
        </div>

        {/* Cart & Profile */}
        <div className="flex items-center space-x-4">
          <button className="relative p-2 hover:bg-cyan-100 rounded-lg">
            <ShoppingCart className="w-6 h-6 text-pink-600" />
            <span className="absolute -top-1 -right-1 bg-cyan-400 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">3</span>
          </button>

          {/* Profile */}
          <div className="relative">
            <div 
              className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-cyan-200 shadow-md"
              onClick={() => setShowProfile(!showProfile)}
            >
              <User className="w-5 h-5 text-pink-600" />
            </div>

            {showProfile && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-lg border border-cyan-200 z-50">
                <div className="bg-gradient-to-r from-pink-300 to-cyan-200 p-6 text-pink-800 flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                    <User className="w-8 h-8 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Admin TokoBoneka</h3>
                    <p className="text-sm text-pink-700/80">admin@tokoboneka.com</p>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <button onClick={() => navigate('/edit-profile')} className="w-full text-left px-4 py-3 hover:bg-cyan-50 rounded-xl flex items-center gap-3">
                    <User className="w-5 h-5 text-cyan-500" /> <span>Edit Profil</span>
                  </button>
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-pink-400 to-cyan-400 text-white rounded-xl hover:from-pink-500 hover:to-cyan-500 transition-all">Keluar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hamburger Dropdown */}
      <div className={`absolute top-full left-0 right-0 bg-[#FFF5FA] shadow-xl border-t-4 border-pink-200 transition-all duration-500 z-40 ${isMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-8 invisible'}`}>
        <div className="max-w-7xl mx-auto py-8 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {navItems.map(item => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.path)}
                className={`group relative p-6 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center ${
                  isActive ? 'ring-4 ring-cyan-300 scale-105' : ''
                }`}
              >
                <div className={`w-16 h-16 mb-4 flex items-center justify-center rounded-xl shadow-md ${
                  isActive ? 'bg-gradient-to-br from-pink-400 to-cyan-300 text-white scale-110' : 'bg-gradient-to-br from-pink-50 to-cyan-50 text-pink-500 group-hover:from-pink-400 group-hover:to-cyan-300 group-hover:text-white group-hover:scale-110'
                }`}>
                  {item.icon}
                </div>
                <h3 className={`font-bold text-lg ${isActive ? 'text-pink-600' : 'text-gray-800 group-hover:text-cyan-500'}`}>{item.name}</h3>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NavbarAdmin;
