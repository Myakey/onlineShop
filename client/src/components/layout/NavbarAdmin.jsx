import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Package, FileText, Plus, LayoutDashboard, Menu, User } from "lucide-react";

const NavbarAdmin = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      name: "Admin Dashboard",
      key: "dashboard",
      path: "/admin-dashboard",
      icon: <LayoutDashboard className="w-8 h-8" />,
      description: "Kelola dashboard admin dan statistik toko",
    },
    {
      name: "Dashboard",
      key: "dashboard-main",
      path: "/",
      icon: <Menu className="w-8 h-8" />,
      description: "Kembali ke halaman utama toko",
    },
    {
      name: "Products",
      key: "product",
      path: "/admin/products",
      icon: <Package className="w-8 h-8" />,
      description: "Lihat dan kelola semua produk boneka",
    },
    {
      name: "Orders",
      key: "orders",
      path: "/admin/orders",
      icon: <FileText className="w-8 h-8" />,
      description: "Kelola dan pantau pesanan pelanggan",
    },
    {
      name: "Add Product",
      key: "add-product",
      path: "/admin/add-product",
      icon: <Plus className="w-8 h-8" />,
      description: "Tambahkan produk boneka baru ke toko",
    },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleProfile = () => setShowProfile((prev) => !prev);

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
              <div
                className={`h-0.5 bg-pink-600 transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></div>
              <div
                className={`h-0.5 bg-pink-600 transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              ></div>
              <div
                className={`h-0.5 bg-pink-600 transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></div>
            </div>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center shadow-md">
              <span className="text-2xl">🧸</span>
            </div>
            <span className="text-pink-700 font-bold text-xl hidden md:block">
              TokoBoneka Admin
            </span>
          </div>
        </div>

        {/* Profile */}
        <div className="relative">
          <div
            className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-cyan-200 transition-all duration-300 transform hover:scale-110 shadow-md z-50"
            onClick={toggleProfile}
          >
            <User className="w-6 h-6 text-pink-600" />
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
                      <p className="text-sm text-pink-700/80">
                        admin@tokoboneka.com
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full text-left px-4 py-3 hover:bg-cyan-50 rounded-xl transition-colors flex items-center space-x-3"
                  >
                    <User className="w-5 h-5 text-cyan-500" />
                    <span className="text-gray-700 font-medium">Edit Profil</span>
                  </button>
                  <hr className="my-2 border-gray-200" />
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-pink-400 to-cyan-400 text-white rounded-xl hover:from-pink-500 hover:to-cyan-500 transition-all duration-300 font-medium shadow-md transform hover:scale-105">
                    Keluar
                  </button>
                </div>
              </div>
              <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                onClick={() => setShowProfile(false)}
              ></div>
            </>
          )}
        </div>
      </nav>

      {/* Dropdown */}
      <div
        className={`absolute top-full left-0 right-0 bg-[#FFF5FA] shadow-xl border-t-4 border-pink-200 transition-all duration-500 ease-in-out transform z-40 ${
          isMenuOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-8 invisible"
        }`}
      >
        <div className="max-w-7xl mx-auto py-10 px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent mb-3">
              🎯 Admin Control Panel
            </h2>
            <p className="text-gray-600 text-lg">
              Pilih menu yang ingin Anda kelola
            </p>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {navItems.slice(0, 4).map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.path)}
                  className={`group relative overflow-hidden rounded-3xl bg-white p-8 shadow-md hover:shadow-lg transition-all duration-500 transform hover:-translate-y-3 ${
                    isActive ? "ring-4 ring-cyan-300 scale-105" : ""
                  }`}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-100/40 to-cyan-100/30 rounded-full -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-100/30 to-pink-50/20 rounded-full -ml-16 -mb-16"></div>

                  <div className="relative z-10">
                    <div
                      className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-md ${
                        isActive
                          ? "bg-gradient-to-br from-pink-400 to-cyan-300 text-white scale-110"
                          : "bg-gradient-to-br from-pink-50 to-cyan-50 text-pink-500 group-hover:from-pink-400 group-hover:to-cyan-300 group-hover:text-white"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <h3
                      className={`font-bold text-2xl mb-3 ${
                        isActive
                          ? "text-pink-600"
                          : "text-gray-800 group-hover:text-cyan-500"
                      }`}
                    >
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 min-h-[3rem]">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Add Product full width */}
          <div className="flex justify-center">
            {(() => {
              const item = navItems[4];
              const isActive = currentPath === item.path;
              return (
                <button
                  onClick={() => handleNavClick(item.path)}
                  className={`group w-full md:w-3/4 lg:w-1/2 relative overflow-hidden rounded-3xl bg-white p-10 shadow-md hover:shadow-lg transition-all duration-500 transform hover:-translate-y-3 ${
                    isActive ? "ring-4 ring-cyan-300 scale-105" : ""
                  }`}
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-100/40 to-cyan-100/30 rounded-full -mr-32 -mt-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-100/30 to-pink-50/20 rounded-full -ml-24 -mb-24"></div>

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-md ${
                        isActive
                          ? "bg-gradient-to-br from-pink-400 to-cyan-300 text-white scale-110"
                          : "bg-gradient-to-br from-pink-50 to-cyan-50 text-pink-500 group-hover:from-pink-400 group-hover:to-cyan-300 group-hover:text-white"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <h3
                      className={`font-bold text-3xl mb-3 ${
                        isActive
                          ? "text-pink-600"
                          : "text-gray-800 group-hover:text-cyan-500"
                      }`}
                    >
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-base mb-4">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarAdmin;
