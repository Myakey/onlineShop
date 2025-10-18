import React, { useState, useEffect } from "react";
import { Search, Filter, Grid, List } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import ProductCard from "../../components/product/ProductCard";
import FilterPanel from "../../components/product/FilterPanel";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/products");
        const data = await res.json();

        // Jika API mengembalikan price sebagai Decimal, ubah ke number
        const formattedData = data.map((p) => ({
          ...p,
          price: parseFloat(p.price),
        }));

        setProducts(formattedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search and price
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesPrice = true;

    if (priceRange === "low") matchesPrice = product.price < 22;
    if (priceRange === "mid") matchesPrice = product.price >= 22 && product.price < 27;
    if (priceRange === "high") matchesPrice = product.price >= 27;

    return matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-pink-50 to-sky-50">
      {/* Navbar */}
      <Navbar />

      {/* Search + View Mode */}
      <div className="px-8 py-6 sticky top-0 bg-white/90 backdrop-blur-lg z-10 border-b border-pink-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
            <input
              type="text"
              placeholder="Cari boneka..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-pink-50 border border-pink-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
            />
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center gap-2 px-4 py-3 bg-pink-50 hover:bg-pink-100 text-gray-700 rounded-xl transition-all border border-pink-200">
              <Filter size={20} /> Filter
            </button>
            <div className="flex bg-pink-50 rounded-xl border border-pink-200 overflow-hidden">
              <button onClick={() => setViewMode("grid")} className={`p-3 transition-all ${viewMode === "grid" ? "bg-gradient-to-r from-pink-400 to-sky-400 text-white" : "text-gray-700 hover:bg-pink-100"}`}>
                <Grid size={20} />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-3 transition-all ${viewMode === "list" ? "bg-gradient-to-r from-pink-400 to-sky-400 text-white" : "text-gray-700 hover:bg-pink-100"}`}>
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <FilterPanel filterOpen={filterOpen} priceRange={priceRange} setPriceRange={setPriceRange} />
      </div>

      {/* Product List/Grid */}
      <div className="px-8 py-12 flex-1">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-16 text-gray-500">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-xl">Tidak ada boneka ditemukan</p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-gray-600 font-medium">Menampilkan {filteredProducts.length} boneka</div>
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.product_id} product={product} viewMode={viewMode} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Product;
