// src/components/admin/ReviewCard.jsx
import React from 'react';
import { X, MessageCircle, Star } from 'lucide-react';

const ReviewCard = ({ review, onDelete, onReply }) => {
  const renderStars = (rating) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg">
      <div className="h-48 bg-gray-300 flex items-center justify-center">
        <div className="w-16 h-16 bg-gray-400 rounded"></div>
      </div>
      <div className="p-6">
        {renderStars(review.rating)}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{review.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{review.body}</p>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{review.reviewer}</p>
            <p className="text-xs text-gray-500">{review.date}</p>
          </div>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => onDelete(review.id)}
            className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4 mr-2" /> Delete Review
          </button>
          <button
            onClick={() => onReply(review.id)}
            className="w-full py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <MessageCircle className="w-4 h-4 mr-2" /> Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
