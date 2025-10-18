// Update the ReviewCard component to match the API response format
import React from "react";
import { Star, Trash2, Shield } from "lucide-react";

const ReviewCard = ({ review, onDelete, currentUserId }) => {
  const {
    review_id,
    rating,
    title,
    comment,
    images = [],
    is_verified,
    created_at,
    user,
  } = review;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  // Check if current user owns this review
  const isOwner = currentUserId && user?.user_id === currentUserId;

  console.log('review', review);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-sky-400 flex items-center justify-center text-white font-bold">
            {user?.profileImageUrl ? (
              <img 
                src={user.profileImageUrl} 
                alt={user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              user?.username?.charAt(0).toUpperCase() || '?'
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">
                {user?.full_name || user?.username || 'Anonymous'}
              </h4>
              {is_verified && (
                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                  <Shield size={12} />
                  <span>Verified Purchase</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">{formatDate(created_at)}</p>
          </div>
        </div>

        {/* Delete Button - only show for review owner */}
        {isOwner && onDelete && (
          <button
            onClick={() => onDelete(review_id)}
            className="text-red-500 hover:text-red-700 transition-colors"
            title="Hapus review"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Star Rating */}
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>

      {/* Review Title */}
      {title && (
        <h5 className="font-semibold text-gray-900 mb-2 text-lg">
          {title}
        </h5>
      )}

      {/* Review Comment */}
      {comment && (
        <p className="text-gray-700 mb-4 leading-relaxed">
          {comment}
        </p>
      )}

      {/* Review Images */}
      {images && images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Review ${idx + 1}`}
              className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => window.open(img, '_blank')}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;