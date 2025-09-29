// src/pages/AdminReviews.jsx
import React, { useState } from 'react';
import ReviewCard from '../components/review/ReviewCard';
import ReviewStats from '../components/review/ReviewStats';
import ReviewFilters from '../components/review/ReviewFilters';
import { Star } from 'lucide-react';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([
    { id: 1, title: 'Review title', body: 'Review body', rating: 0, reviewer: 'Reviewer Name', date: '2 Jan' },
    { id: 2, title: 'Review title', body: 'Review body', rating: 0, reviewer: 'Reviewer Name', date: '2 Jan' },
    { id: 3, title: 'Review title', body: 'Review body', rating: 0, reviewer: 'Reviewer Name', date: '2 Jan' }
  ]);

  const handleDeleteReview = (id) => setReviews(reviews.filter(r => r.id !== id));
  const handleReply = (id) => console.log('Reply to review:', id);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Customer Reviews</h1>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Star className="w-12 h-12 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Reviews Yet</h3>
          <p className="text-gray-500">Customer reviews will appear here once they start reviewing your products.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {reviews.map(review => (
              <ReviewCard
                key={review.id}
                review={review}
                onDelete={handleDeleteReview}
                onReply={handleReply}
              />
            ))}
          </div>

          <ReviewStats reviews={reviews} />
          <ReviewFilters />
        </>
      )}
    </div>
  );
};

export default AdminReviews;
