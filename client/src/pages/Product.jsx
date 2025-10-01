import React, { useState, useEffect } from "react";
import { Search, Filter, Grid, List } from "lucide-react";

// Mock ProductCard component for demonstration
const ProductCard = ({ product, viewMode }) => (
  <div className={`bg-white rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-pink-300/40 transition-all duration-300 hover:-translate-y-1 border border-pink-100 ${viewMode === 'list' ? 'flex' : ''}`}>
    <img 
      src={product.image} 
      alt={product.name} 
      className={`w-full object-cover ${viewMode === 'list' ? 'w-48' : 'h-48'}`}
    />
    <div className="p-5">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
      <p className="text-pink-500 text-lg font-semibold">{product.price}</p>
      <button className="mt-4 w-full bg-gradient-to-r from-pink-400 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-pink-500 hover:to-pink-700 transition-all shadow-md hover:shadow-lg">
        Add to Cart
      </button>
    </div>
  </div>
);

const mockProducts = [
  { product_id: 1, name: "Classic Burger", price: "$12.99", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop" },
  { product_id: 2, name: "Chicken Deluxe", price: "$14.99", image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop" },
  { product_id: 3, name: "Veggie Burger", price: "$11.99", image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop" },
  { product_id: 4, name: "BBQ Bacon Burger", price: "$15.99", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop" },
  { product_id: 5, name: "Double Cheese", price: "$13.99", image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop" },
  { product_id: 6, name: "Fish Burger", price: "$12.49", image: "https://images.unsplash.com/photo-1585238341710-4a5a3bbbc3d5?w=400&h=300&fit=crop" },
];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState("all");

  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const price = parseFloat(product.price.replace('$', ''));
    
    let matchesPrice = true;
    if (priceRange === "low") matchesPrice = price < 13;
    if (priceRange === "mid") matchesPrice = price >= 13 && price < 15;
    if (priceRange === "high") matchesPrice = price >= 15;
    
    return matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-200/30 to-pink-300/30"></div>
        <div className="relative px-8 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
            Our Menu
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our delicious selection of handcrafted burgers
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="px-8 py-6 sticky top-0 bg-white/90 backdrop-blur-lg z-10 border-b border-pink-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-pink-50 border border-pink-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-4 py-3 bg-pink-50 hover:bg-pink-100 text-gray-700 rounded-xl transition-all border border-pink-200"
            >
              <Filter size={20} />
              Filter
            </button>
            
            <div className="flex bg-pink-50 rounded-xl border border-pink-200 overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 transition-all ${viewMode === "grid" ? "bg-pink-400 text-white" : "text-gray-700 hover:bg-pink-100"}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 transition-all ${viewMode === "list" ? "bg-pink-400 text-white" : "text-gray-700 hover:bg-pink-100"}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {filterOpen && (
          <div className="max-w-7xl mx-auto mt-4 p-4 bg-pink-50 rounded-xl border border-pink-200">
            <h3 className="font-semibold mb-3 text-gray-800">Price Range</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "All Prices" },
                { value: "low", label: "Under $13" },
                { value: "mid", label: "$13 - $15" },
                { value: "high", label: "$15+" }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setPriceRange(option.value)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    priceRange === option.value
                      ? "bg-gradient-to-r from-pink-400 to-pink-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-pink-100 border border-pink-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-xl">No products found</p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-gray-600 font-medium">
                Showing {filteredProducts.length} products
              </div>
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.product_id} product={product} viewMode={viewMode} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;