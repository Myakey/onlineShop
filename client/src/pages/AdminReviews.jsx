// src/pages/Reviews.jsx
import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import ReviewCard from '../components/review/ReviewCard';
import ReviewStats from '../components/review/ReviewStats';
import ReviewFilters from '../components/review/ReviewFilters';

// Generate mock reviews
const generateMockReviews = (num) => {
  const reviewers = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
  const titles = ['Great product!', 'Not bad', 'Could be better', 'Loved it!', 'Disappointed', 'Excellent', 'Average', 'Amazing!'];
  const bodies = [
    'Really enjoyed this product.',
    'It works as expected.',
    'Not satisfied with the quality.',
    'Exceeded my expectations!',
    'Would not recommend.',
    'Perfect for the price.',
    'Okay, nothing special.',
    'Highly recommended!'
  ];

  return Array.from({ length: num }, (_, i) => ({
    id: i + 1,
    title: titles[i % titles.length],
    body: bodies[i % bodies.length],
    rating: Math.floor(Math.random() * 5) + 1, // 1-5
    reviewer: reviewers[i % reviewers.length],
    date: `${Math.floor(Math.random() * 28) + 1} Sep`,
  }));
};

const Reviews = () => {
  const [reviews, setReviews] = useState(generateMockReviews(10));
  const [filter, setFilter] = useState('All Reviews');

  // State untuk form review baru
  const [newReview, setNewReview] = useState({
    reviewer: '',
    title: '',
    body: '',
    rating: 5,
  });

  // Tambah review baru
  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.reviewer || !newReview.title || !newReview.body) return;

    const reviewToAdd = {
      id: reviews.length + 1,
      ...newReview,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    };

    setReviews([reviewToAdd, ...reviews]); // masukkan ke atas
    setNewReview({ reviewer: '', title: '', body: '', rating: 5 }); // reset form
  };

  // Filter reviews
  const filteredReviews = reviews.filter(r => {
    if (filter === 'All Reviews') return true;
    if (filter === '5 Stars') return r.rating === 5;
    if (filter === '4 Stars') return r.rating === 4;
    if (filter === '3 Stars') return r.rating === 3;
    if (filter === '2 Stars') return r.rating === 2;
    if (filter === '1 Star') return r.rating === 1;
    if (filter === 'Recent') return true;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50">
      {/* Navbar user */}
      <Navbar currentPage="reviews" />

      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Customer Reviews</h1>

        {/* Form Tambah Review */}
        <form 
          onSubmit={handleAddReview} 
          className="bg-white shadow-md rounded-lg p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Write a Review</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              value={newReview.reviewer}
              onChange={(e) => setNewReview({ ...newReview, reviewer: e.target.value })}
              className="border rounded-lg p-2 w-full"
              required
            />
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
              className="border rounded-lg p-2 w-full"
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
              <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
              <option value={3}>⭐⭐⭐ (3 Stars)</option>
              <option value={2}>⭐⭐ (2 Stars)</option>
              <option value={1}>⭐ (1 Star)</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Review Title"
            value={newReview.title}
            onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
            className="border rounded-lg p-2 w-full mt-4"
            required
          />

          <textarea
            placeholder="Your Review"
            value={newReview.body}
            onChange={(e) => setNewReview({ ...newReview, body: e.target.value })}
            className="border rounded-lg p-2 w-full mt-4"
            rows="3"
            required
          />

          <button
            type="submit"
            className="bg-pink-500 text-white px-6 py-2 rounded-lg mt-4 hover:bg-pink-600 transition"
          >
            Submit Review
          </button>
        </form>

        {/* Filter */}
        <ReviewFilters filter={filter} setFilter={setFilter} />

        {filteredReviews.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Reviews Found</h3>
            <p className="text-gray-500">No reviews match the selected filter.</p>
          </div>
        ) : (
          <div className="space-y-6 my-6">
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                isAdmin={false} // user view
              />
            ))}

            <ReviewStats reviews={filteredReviews} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
