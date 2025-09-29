// src/components/admin/ReviewStats.jsx
import React from 'react';

const ReviewStats = ({ reviews }) => {
  const averageRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : 0;
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg p-4 text-center">
        <h3 className="text-2xl font-bold text-gray-800">{reviews.length}</h3>
        <p className="text-gray-600">Total Reviews</p>
      </div>
      <div className="bg-white rounded-lg p-4 text-center">
        <h3 className="text-2xl font-bold text-yellow-500">{averageRating}</h3>
        <p className="text-gray-600">Average Rating</p>
      </div>
      <div className="bg-white rounded-lg p-4 text-center">
        <h3 className="text-2xl font-bold text-green-600">85%</h3>
        <p className="text-gray-600">Positive Reviews</p>
      </div>
      <div className="bg-white rounded-lg p-4 text-center">
        <h3 className="text-2xl font-bold text-blue-600">12</h3>
        <p className="text-gray-600">This Month</p>
      </div>
    </div>
  );
};

export default ReviewStats;
