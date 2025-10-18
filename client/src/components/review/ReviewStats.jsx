// Update ReviewStats to use the stats object from API
import React from "react";
import { Star } from "lucide-react";

const ReviewStats = ({ stats }) => {
  const {
    average_rating = 0,
    total_reviews = 0,
    rating_distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    rating_percentages = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  } = stats || {};

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Overall Rating */}
        <div className="flex flex-col items-center justify-center border-r border-gray-200">
          <div className="text-6xl font-bold text-gray-900 mb-2">
            {average_rating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={24}
                className={
                  i < Math.round(average_rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <p className="text-gray-600 text-sm">
            Based on {total_reviews} {total_reviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12">
                <span className="text-sm font-medium text-gray-700">{star}</span>
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
              </div>
              
              {/* Progress Bar */}
              <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${rating_percentages[star] || 0}%` }}
                />
              </div>
              
              <div className="w-16 text-right">
                <span className="text-sm text-gray-600">
                  {rating_distribution[star] || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewStats;