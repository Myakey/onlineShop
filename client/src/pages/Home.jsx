import React, { useState, useEffect } from "react";

const mockProducts = [
  { product_id: 1, name: "Classic Burger", price: "$12.99", image: "/api/placeholder/300/200" },
  { product_id: 2, name: "Chicken Deluxe", price: "$14.99", image: "/api/placeholder/300/200" },
  { product_id: 3, name: "Veggie Burger", price: "$11.99", image: "/api/placeholder/300/200" },
];

const ProductCard = ({ product, onDelete }) => (
  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
    <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
      <p className="text-green-400 font-bold text-lg">{product.price}</p>
      <button 
        onClick={() => onDelete(product.product_id)}
        className="mt-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white text-sm"
      >
        Delete
      </button>
    </div>
  </div>
);

const Button = ({ onClick, text }) => (
  <button 
    onClick={onClick}
    className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-semibold transition-colors text-white"
  >
    {text}
  </button>
);

function HomePage() {
  const [products, setProducts] = useState([]);

  const handleDelete = (id) => {
    console.log("Deleting product with id:", id);
    setProducts(products.filter(product => product.product_id !== id));
  }

  useEffect(() => {
    // Simulate API call
    setProducts(mockProducts);
  }, []);

  const goToAddItem = () => {
    console.log("Navigate to add product page");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 bg-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
        </div>
        <div className="flex items-center space-x-8">
          <a href="#" className="hover:text-gray-300">Home</a>
          <a href="#" className="hover:text-gray-300">Menu</a>
          <a href="#" className="hover:text-gray-300">Review</a>
          <a href="#" className="hover:text-gray-300">Order</a>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h10M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
              </svg>
            </div>
            <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Join the (UNKNOWN's Name) Conventional
          </h1>
          <div className="relative mx-auto mb-8">
            <div className="w-80 h-80 mx-auto">
              <img 
                src="/api/placeholder/400/400" 
                alt="Delicious Burger" 
                className="w-full h-full object-cover rounded-full shadow-2xl"
              />
            </div>
          </div>
          <button className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-semibold transition-colors">
            Register
          </button>
          
          {/* Navigation dots */}
          <div className="flex justify-center space-x-2 mt-8">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          </div>
        </div>
        
        {/* Navigation arrows */}
        <button className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="absolute right-8 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">(UNKNOWN's) Timeline</h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-green-500"></div>
            
            {/* Timeline items */}
            <div className="space-y-12">
              {/* 1989 */}
              <div className="flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <img src="/api/placeholder/200/150" alt="1989" className="ml-auto rounded-lg shadow-lg" />
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10"></div>
                <div className="w-1/2 pl-8">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-green-400 mb-2">1989</h3>
                    <p className="text-sm text-gray-300">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2003 */}
              <div className="flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-green-400 mb-2">2003</h3>
                    <p className="text-sm text-gray-300">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10"></div>
                <div className="w-1/2 pl-8">
                  <img src="/api/placeholder/200/150" alt="2003" className="rounded-lg shadow-lg" />
                </div>
              </div>

              {/* 2015 */}
              <div className="flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <img src="/api/placeholder/200/150" alt="2015" className="ml-auto rounded-lg shadow-lg" />
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10"></div>
                <div className="w-1/2 pl-8">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-green-400 mb-2">2015</h3>
                    <p className="text-sm text-gray-300">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                  </div>
                </div>
              </div>

              {/* Now */}
              <div className="flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-green-400 mb-2">Now</h3>
                    <p className="text-sm text-gray-300">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10"></div>
                <div className="w-1/2 pl-8">
                  <img src="/api/placeholder/200/150" alt="Now" className="rounded-lg shadow-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Info Section */}
      <section className="py-16 px-8 bg-gradient-to-r from-orange-100 to-yellow-100">
        <div className="max-w-6xl mx-auto text-gray-900">
          <div className="relative">
            {/* Central burger image */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-64 h-64">
                <img src="/api/placeholder/300/300" alt="Burger" className="w-full h-full object-cover" />
              </div>
            </div>
            
            {/* Info boxes around the burger */}
            <div className="grid grid-cols-2 gap-8 items-center min-h-96">
              <div className="space-y-8">
                {/* Fresh Ingredients */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="font-bold text-lg mb-2">Fresh Ingredients</h3>
                  <p className="text-sm text-gray-600">
                    We use only the freshest ingredients sourced from local farms to ensure the best quality and taste.
                  </p>
                </div>
                
                {/* Made to Status */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="font-bold text-lg mb-2">Made to Status</h3>
                  <p className="text-sm text-gray-600">
                    Every burger is made to order, ensuring you get the perfect meal exactly how you want it.
                  </p>
                </div>
              </div>
              
              <div className="space-y-8">
                {/* High Quality */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="font-bold text-lg mb-2">High Quality</h3>
                  <p className="text-sm text-gray-600">
                    Premium ingredients and careful preparation result in consistently high-quality meals.
                  </p>
                </div>
                
                {/* Enticing Offers */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="font-bold text-lg mb-2">Enticing Offers</h3>
                  <p className="text-sm text-gray-600">
                    Special deals and combo offers that give you great value for delicious food.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.product_id} product={product} onDelete={handleDelete}/>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button onClick={goToAddItem} text={"Add New Item"} />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-8 rounded-xl text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Get special privilege and exclusive deal!</h3>
            <p className="text-lg mb-6">RP 150.000 OFF</p>
            <button className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-gray-600 rounded"></div>
              <div className="w-8 h-8 bg-gray-600 rounded"></div>
              <div className="w-8 h-8 bg-gray-600 rounded"></div>
            </div>
          </div>
          <div className="text-gray-400 text-sm">
            <p>© 2024 Restaurant Name. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;