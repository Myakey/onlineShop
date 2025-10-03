// src/components/admin/ReviewStats.jsx
import React from 'react';
import { Star, ThumbsUp, Calendar } from 'lucide-react';

const ReviewStats = ({ reviews }) => {
  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : 0;

  // Hitung persentase review positif (rating >= 4)
  const positiveReviews = totalReviews
    ? Math.round((reviews.filter(r => r.rating >= 4).length / totalReviews) * 100)
    : 0;

  // Hitung review bulan ini (dummy)
  const thisMonth = totalReviews; // bisa diganti logic tanggal sesuai data nyata

  const stats = [
    { label: 'Total Reviews', value: totalReviews, icon: <Star className="w-6 h-6 text-yellow-500" /> },
    { label: 'Average Rating', value: averageRating, icon: <Star className="w-6 h-6 text-yellow-400" /> },
    { label: 'Positive Reviews', value: `${positiveReviews}%`, icon: <ThumbsUp className="w-6 h-6 text-green-500" /> },
    { label: 'This Month', value: thisMonth, icon: <Calendar className="w-6 h-6 text-blue-500" /> },
  ];

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg p-4 flex items-center space-x-4 shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="p-2 bg-gray-100 rounded-full">{stat.icon}</div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewStats;
