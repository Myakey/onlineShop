import React from 'react';
import { Users } from 'lucide-react';

const Header = () => (
  <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
    <div className="flex items-center justify-between">
      <div className="flex space-x-6">
        <a href="#" className="text-white font-medium border-b-2 border-white pb-1">Home</a>
        <a href="#" className="text-gray-400 hover:text-white">Products</a>
        <a href="#" className="text-gray-400 hover:text-white">Reviews</a>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-700 text-white px-4 py-2 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute left-3 top-2.5">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
          <Users className="w-4 h-4" />
        </div>
      </div>
    </div>
  </div>
);

export default Header;
