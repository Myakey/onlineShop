// src/components/admin/ReviewFilters.jsx
import React from 'react';

const ReviewFilters = () => {
  const filters = ['All Reviews', '5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star', 'Recent'];

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {filters.map((filter, index) => (
        <button
          key={index}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default ReviewFilters;
