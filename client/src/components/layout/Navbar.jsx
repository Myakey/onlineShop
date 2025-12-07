import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Package,
  Star,
  ShoppingCart,
  User,
  Search,
  X,
  LayoutDashboard,
  Plus,
  FileText,
  LogIn,
  Heart,
} from "lucide-react";
import authService from "../../services/authService";
import { useUser } from "../../context/userContext";
import { useCart } from "../../context/cartContext";

const Navbar = () => {
  const { user, setUser, loading, isAuthenticated, isAdmin } = useUser();
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPageState, setCurrentPageState] = useState({ path: "/", key: "home" });

  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const toggleProfile = () => setShowProfile(prev => !prev);
  const clearSearch = () => setSearchQuery("");

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const path = location.pathname;
    let key = "home";

    if (path.includes("/admin-dashboard")) key = "dashboard";
    else if (path.includes("/admin/products")) key = "products";
    else if (path.includes("/admin/orders")) key = "orders";
    else if (path.includes("/admin/add-product")) key = "add-product";
    else if (path === "/products") key = "products";
    else if (path === "/reviews") key = "reviews";
    else if (path === "/order-list") key = "order";
    else if (path === "/cart") key = "cart";
    else if (path === "/wishlist") key = "wishlist";

    setCurrentPageState({ path, key });
  }, [location.pathname]);

  const getIcon = (key) => {
    const icons = {
      home: <Home className="w-8 h-8" />,
      products: <Package className="w-8 h-8" />,
      reviews: <Star className="w-8 h-8" />,
      order: <ShoppingCart className="w-8 h-8" />,
      dashboard: <LayoutDashboard className="w-8 h-8" />,
      orders: <FileText className="w-8 h-8" />,
      "add-product": <Plus className="w-8 h-8" />,
    };
    return icons[key] || <Home className="w-8 h-8" />;
  };

  const goToHome = () => navigate("/");
  const goToProfile = () => navigate("/profile");
  const goToLogin = () => navigate("/login");
  const goToCart = () => navigate("/cart");

  const navItems = (() => {
    if (loading) return [];
    if (isAdmin) {
      return [
        { name: "Dashboard", key: "dashboard", path: "/admin-dashboard", description: "Kelola dashboard admin dan statistik" },
        { name: "Products", key: "products", path: "/admin/products", description: "Lihat dan kelola semua produk" },
        { name: "Home (Shop)", key: "home", path: "/", description: "Kembali ke halaman utama toko" },
        { name: "Orders", key: "orders", path: "/admin/orders", description: "Kelola pesanan pelanggan" },
        { name: "Add Product", key: "add-product", path: "/admin/add-product", description: "Tambahkan produk baru" },
      ];
    }
    return [
      { name: "Home", key: "home", path: "/", description: "Halaman utama toko kami" },
      { name: "Products", key: "products", path: "/products", description: "Jelajahi koleksi produk lengkap" },
      { name: "Reviews", key: "reviews", path: "/reviews", description: "Baca review dan testimoni pelanggan" },
      { name: "Orders", key: "order", path: "/order-list", description: "Lihat daftar pesanan Anda" },
    ];
  })();

  const handleLogOut = async () => {
    try {
      await authService.logout();
      setUser(null);
      setShowProfile(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed: ", error);
      setUser(null);
      navigate("/");
    }
  };

  const handleNavClick = (path, key) => {
    setCurrentPageState({ key, path });
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
  <div className="sticky top-0 left-0 right-0 z-[100]">
      <nav className="sticky flex items-center justify-between px-6 py-0 bg-gradient-to-r from-pink-300 via-pink-100 to-white shadow-md z-50">
        <div className="flex items-center space-x-4">
          <button onClick={toggleMenu} className="p-2 hover:bg-pink-200 rounded-lg transition-all duration-300 transform hover:scale-110">
            <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
              <div className={`h-0.5 bg-pink-600 transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}></div>
              <div className={`h-0.5 bg-pink-600 transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}></div>
              <div className={`h-0.5 bg-pink-600 transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
            </div>
          </button>
          <div className="flex items-center space-x-2" onClick={goToHome} style={{cursor: 'pointer'}}>
            <div>
              <img
                src="/logo.png"
                alt="Logo"
                className="w-20 h-20"
              />
            </div>
            <span className="text-pink-700 font-bold text-xl hidden md:block select-none">Monmon's Hobbies</span>
          </div>
        </div>

        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-pink-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="block w-full pl-12 pr-12 py-3 bg-white border border-pink-300 text-pink-700 rounded-full placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-500 transition-all duration-300"
              placeholder="Cari produk favoritmu..."
            />
            {searchQuery && (
              <button onClick={clearSearch} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <X className="h-5 w-5 text-pink-400 hover:text-pink-600 transition-colors" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {!loading && isAuthenticated && !isAdmin && (
            <button className="relative p-2 hover:bg-pink-200 rounded-lg transition-all duration-300 transform hover:scale-110" onClick={goToCart}>
              <ShoppingCart className="w-6 h-6 text-pink-600"/>
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow animate-pulse">
                {cartCount}
              </span>
            </button>
          )}

          {loading ? (
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center animate-pulse">
              <User className="w-6 h-6 text-pink-400" />
            </div>
          ) : isAuthenticated ? (
            <div className="relative">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-200 transition-all duration-300 transform hover:scale-110 shadow-md z-50 overflow-hidden" onClick={toggleProfile}>
                {user?.profileImageUrl ? <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover"/> : <User className="w-6 h-6 text-pink-600" />}
              </div>

              {showProfile && (
                <>
                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-lg overflow-hidden z-50 border border-pink-200">
                    <div className="bg-gradient-to-r from-pink-300 to-pink-200 p-6 text-pink-800">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden">
                          {user?.profileImageUrl ? <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover"/> : <User className="w-8 h-8 text-pink-600" />}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{user?.firstName || user?.name || "User"}</h3>
                          <p className="text-sm text-pink-700/80">{user?.email || "user@example.com"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <button onClick={goToProfile} className="w-full text-left px-4 py-3 hover:bg-pink-50 rounded-xl transition-colors flex items-center space-x-3">
                        <User className="w-5 h-5 text-pink-500" />
                        <span className="text-gray-700 font-medium">Edit Profil</span>
                      </button>

                      {!isAdmin && (
                        <>
                          <button onClick={() => { setShowProfile(false); navigate("/wishlist"); }} className="w-full text-left px-4 py-3 hover:bg-pink-50 rounded-xl transition-colors flex items-center space-x-3">
                            <Heart className="w-5 h-5 text-pink-500" />
                            <span className="text-gray-700 font-medium">Wishlist Saya</span>
                          </button>

                          <button onClick={() => navigate("/order-list")} className="w-full text-left px-4 py-3 hover:bg-pink-50 rounded-xl transition-colors flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-pink-500" />
                            <span className="text-gray-700 font-medium">Pesanan Saya</span>
                          </button>
                        </>
                      )}

                      <hr className="my-2 border-gray-200" />
                      <button onClick={handleLogOut} className="w-full px-4 py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-xl hover:from-pink-500 hover:to-pink-600 transition-all duration-300 font-medium shadow-md transform hover:scale-105">
                        Keluar
                      </button>
                    </div>
                  </div>
                  <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setShowProfile(false)}></div>
                </>
              )}
            </div>
          ) : (
            <button onClick={goToLogin} className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full hover:from-pink-500 hover:to-pink-600 transition-all duration-300 font-medium shadow-md transform hover:scale-105">
              <LogIn className="w-5 h-5" />
              <span>Masuk</span>
            </button>
          )}
        </div>
      </nav>

      <div className={`absolute top-full left-0 right-0 bg-[#FFF5FA] shadow-xl border-t-4 border-pink-200 transition-all duration-500 ease-in-out transform z-40 ${isMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-8 invisible"}`}>
        <div className="max-w-7xl mx-auto py-10 px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-pink-400 bg-clip-text text-transparent mb-3">{isAdmin ? "🎯 Admin Control Panel" : "🍽️ Jelajahi Menu Kami"}</h2>
            <p className="text-gray-600 text-lg">Pilih kategori yang ingin Anda kunjungi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {navItems.filter(item => item.key !== "add-product").map(item => (
              <button key={item.key} onClick={() => handleNavClick(item.path, item.key)} className={`group relative overflow-hidden rounded-3xl bg-white p-8 shadow-md hover:shadow-lg transition-all duration-500 transform hover:-translate-y-3 ${currentPageState.key === item.key ? "ring-4 ring-pink-300 scale-105" : ""}`}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-100/40 to-pink-100/30 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-100/30 to-pink-50/20 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10 text-left">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 shadow-md ${currentPageState.key === item.key ? "bg-gradient-to-br from-pink-400 to-pink-300 text-white scale-110" : "bg-gradient-to-br from-pink-50 to-pink-50 text-pink-500 group-hover:from-pink-400 group-hover:to-pink-300 group-hover:text-white group-hover:scale-110"}`}>{getIcon(item.key)}</div>
                  <h3 className={`font-bold text-2xl mb-3 transition-colors duration-300 ${currentPageState.key === item.key ? "text-pink-600" : "text-gray-800 group-hover:text-pink-500"}`}>{item.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 min-h-[3rem]">{item.description}</p>
                </div>
              </button>
            ))}
          </div>

          {isAdmin && (
            <div className="flex justify-center mb-8">
              <button onClick={() => handleNavClick("/admin/add-product", "add-product")} className={`group w-full md:w-3/4 lg:w-1/2 relative overflow-hidden rounded-3xl bg-white p-10 shadow-md hover:shadow-lg transition-all duration-500 transform hover:-translate-y-3 ${currentPageState.key === "add-product" ? "ring-4 ring-pink-300 scale-105" : ""}`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-100/40 to-pink-100/30 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100/30 to-pink-50/20 rounded-full -ml-24 -mb-24"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-md ${currentPageState.key === "add-product" ? "bg-gradient-to-br from-pink-400 to-pink-300 text-white scale-110" : "bg-gradient-to-br from-pink-50 to-pink-50 text-pink-500 group-hover:from-pink-400 group-hover:to-pink-300 group-hover:text-white"}`}><Plus className="w-10 h-10" /></div>
                  <h3 className={`font-bold text-3xl mb-3 ${currentPageState.key === "add-product" ? "text-pink-600" : "text-gray-800 group-hover:text-pink-500"}`}>Tambah Produk</h3>
                  <p className="text-gray-600 text-base mb-4">Tambahkan produk baru ke toko Anda dengan mudah.</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;