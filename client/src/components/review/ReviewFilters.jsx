// Update ReviewFilters to handle filter changes
import React from "react";
import { Star, Filter } from "lucide-react";

const ReviewFilters = ({ onFilterChange, currentFilters = {} }) => {
  const { rating, sort = 'recent' } = currentFilters;

  const handleRatingFilter = (selectedRating) => {
    onFilterChange({ 
      rating: rating === selectedRating ? null : selectedRating 
    });
  };

  const handleSortChange = (selectedSort) => {
    onFilterChange({ sort: selectedSort });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Filter Icon */}
        <div className="flex items-center gap-2 text-gray-700 font-semibold">
          <Filter size={20} />
          <span>Filter & Sort:</span>
        </div>

        {/* Rating Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRatingFilter(null)}
            className={`px-4 py-2 rounded-lg transition-all ${
              !rating
                ? "bg-gradient-to-r from-pink-400 to-sky-400 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Semua
          </button>
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingFilter(star)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 ${
                rating === star
                  ? "bg-gradient-to-r from-pink-400 to-sky-400 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Star
                size={16}
                className={rating === star ? "fill-white" : "fill-yellow-400 text-yellow-400"}
              />
              <span>{star}</span>
            </button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-gray-600 text-sm">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-400 bg-white"
          >
            <option value="recent">Terbaru</option>
            <option value="rating_high">Rating Tertinggi</option>
            <option value="rating_low">Rating Terendah</option>
            <option value="helpful">Paling Membantu</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ReviewFilters;