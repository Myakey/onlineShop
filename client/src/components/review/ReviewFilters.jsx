// src/components/admin/ReviewFilters.jsx
import React from 'react';

const filters = ['All Reviews', '5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star', 'Recent'];

const ReviewFilters = ({ filter, setFilter }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.map((f, idx) => (
        <button
          key={idx}
          onClick={() => setFilter(f)}
          className={`px-4 py-2 rounded-lg transition-all font-medium ${
            filter === f
              ? 'bg-gradient-to-r from-pink-400 to-sky-400 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
};

export default ReviewFilters;
