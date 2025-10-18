import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Upload, X, Check, AlertCircle, ShoppingBag, Package } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import reviewService from '../../services/reviewService';
import { getOrderByToken } from '../../services/orderService';
import api from '../../services/api';

export default function WriteReview() {
  const { token } = useParams(); // Changed from orderId to token
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Track which products have been reviewed
  const [reviewStates, setReviewStates] = useState({});
  const [submitting, setSubmitting] = useState({});

  useEffect(() => {
    loadOrderDetails();
  }, [token]);

  const loadOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Use secure token to fetch order
      const response = await getOrderByToken(token);
      
      if (!response.success) {
        setError(response.message || 'Failed to load order');
        return;
      }

      const orderData = response.data;

      // Check if order is eligible for review
      if (orderData.status !== 'delivered') {
        setError('Only delivered orders can be reviewed');
        return;
      }

      setOrder(orderData);

      // Initialize review states for each product
      const initialStates = {};
      for (const item of orderData.items) {
        try {
          // Check if product can be reviewed using order_id
          const canReview = await reviewService.canUserReview(
            item.product.product_id,
            orderData.order_id // Use the actual order_id from response
          );

          initialStates[item.product.product_id] = {
            rating: 5,
            title: '',
            comment: '',
            images: [],
            canReview: canReview.data?.canReview || false,
            reason: canReview.data?.reason || '',
          };
        } catch (err) {
          console.error(`Failed to check review eligibility for product ${item.product.product_id}:`, err);
          initialStates[item.product.product_id] = {
            rating: 5,
            title: '',
            comment: '',
            images: [],
            canReview: false,
            reason: 'Unable to verify review eligibility',
          };
        }
      }
      setReviewStates(initialStates);
    } catch (err) {
      console.error('Failed to load order:', err);
      setError(err.response?.data?.message || 'Failed to load order details. This order may not exist or you do not have permission to access it.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingChange = (productId, rating) => {
    setReviewStates(prev => ({
      ...prev,
      [productId]: { ...prev[productId], rating }
    }));
  };

  const handleInputChange = (productId, field, value) => {
    setReviewStates(prev => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value }
    }));
  };

  const handleImageUpload = (productId, e) => {
    const files = Array.from(e.target.files);
    const currentImages = reviewStates[productId].images || [];

    if (currentImages.length + files.length > 5) {
      setError('Maximum 5 images per review');
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
      
      if (!isValidType) {
        setError('Only image files are allowed');
        return false;
      }
      if (!isValidSize) {
        setError('Image size must be less than 5MB');
        return false;
      }
      return true;
    });

    // Create preview URLs
    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setReviewStates(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        images: [...currentImages, ...newImages]
      }
    }));

    setError(''); // Clear error if successful
  };

  const removeImage = (productId, index) => {
    const imageToRemove = reviewStates[productId].images[index];
    
    // Revoke object URL to prevent memory leaks
    if (imageToRemove?.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    setReviewStates(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        images: prev[productId].images.filter((_, i) => i !== index)
      }
    }));
  };

  const submitReview = async (productId) => {
    const reviewData = reviewStates[productId];

    if (!reviewData.rating) {
      setError('Please select a rating');
      return;
    }

    if (!reviewData.comment || reviewData.comment.trim().length < 10) {
      setError('Please write a review with at least 10 characters');
      return;
    }

    setSubmitting(prev => ({ ...prev, [productId]: true }));
    setError('');

    try {
      // Upload images first (if any)
      let imageUrls = [];
      if (reviewData.images.length > 0) {
        const formData = new FormData();
        reviewData.images.forEach((img) => {
          formData.append('images', img.file);
        });

        try {
          const uploadResponse = await api.post('/upload/review-images', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          imageUrls = uploadResponse.data.urls || [];
        } catch (uploadErr) {
          console.warn('Image upload failed, continuing without images:', uploadErr);
        }
      }

      // Submit review with actual order_id
      await reviewService.createReview({
        product_id: productId,
        order_id: order.order_id, // Use the actual order_id from the order data
        rating: reviewData.rating,
        title: reviewData.title || null,
        comment: reviewData.comment,
        images: imageUrls.length > 0 ? imageUrls : null,
      });

      const productName = order.items.find(i => i.product.product_id === productId)?.product.name;
      setSuccess(`Review submitted for ${productName}`);

      // Update review state to mark as reviewed
      setReviewStates(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          canReview: false,
          reason: 'Already reviewed'
        }
      }));

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to submit review:', err);
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(prev => ({ ...prev, [productId]: false }));
    }
  };

  const RatingStars = ({ rating, onChange, readonly = false }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onChange(star)}
            disabled={readonly}
            className={`transition-all duration-200 ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            }`}
          >
            <Star
              className={`w-8 h-8 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading order details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error && !order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Order</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => navigate('/order-list')}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-2xl hover:from-pink-600 hover:to-rose-600 font-semibold transition-all duration-300"
              >
                Back to Orders
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-5 rounded-2xl shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-2 border-green-300">
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-green-600" />
                <span className="font-semibold">{success}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-5 rounded-2xl shadow-lg bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-2 border-red-300">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <span className="font-semibold">{error}</span>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl">
                <ShoppingBag className="w-8 h-8 text-pink-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Write Reviews
                </h1>
                <p className="text-gray-600">Order #{order?.order_number}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl">
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-semibold text-gray-800">
                  {new Date(order?.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-semibold">
                  {order?.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="font-semibold text-gray-800">{order?.items?.length || 0} products</p>
              </div>
            </div>
          </div>

          {/* Products to Review */}
          <div className="space-y-6">
            {order?.items?.map((item) => {
              const productId = item.product.product_id;
              const reviewState = reviewStates[productId] || {};
              const isSubmitting = submitting[productId] || false;
              const canReview = reviewState.canReview;

              return (
                <div
                  key={productId}
                  className="bg-white rounded-3xl shadow-2xl p-8 transform hover:shadow-3xl transition-all duration-300"
                >
                  {/* Product Info */}
                  <div className="flex gap-6 mb-6 pb-6 border-b-2 border-pink-100">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.product.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-600 mb-1">Quantity: {item.quantity}</p>
                      <p className="text-lg font-semibold text-pink-600">
                        Rp {parseFloat(item.price).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Review Form or Status */}
                  {!canReview ? (
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-2xl text-center">
                      <Check className="w-12 h-12 text-green-600 mx-auto mb-3" />
                      <p className="text-gray-700 font-semibold">
                        {reviewState.reason || 'This product has been reviewed'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Rating */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Your Rating *
                        </label>
                        <RatingStars
                          rating={reviewState.rating}
                          onChange={(rating) => handleRatingChange(productId, rating)}
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          {reviewState.rating === 5 && 'Excellent!'}
                          {reviewState.rating === 4 && 'Very Good'}
                          {reviewState.rating === 3 && 'Good'}
                          {reviewState.rating === 2 && 'Fair'}
                          {reviewState.rating === 1 && 'Poor'}
                        </p>
                      </div>

                      {/* Title */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Review Title (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="Summarize your experience"
                          className="w-full rounded-2xl border-2 border-pink-200 px-5 py-3.5 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                          value={reviewState.title}
                          onChange={(e) => handleInputChange(productId, 'title', e.target.value)}
                          maxLength={200}
                        />
                      </div>

                      {/* Comment */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Your Review *
                        </label>
                        <textarea
                          placeholder="Tell us about your experience with this product (minimum 10 characters)"
                          rows="5"
                          className="w-full rounded-2xl border-2 border-pink-200 px-5 py-3.5 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300 resize-none"
                          value={reviewState.comment}
                          onChange={(e) => handleInputChange(productId, 'comment', e.target.value)}
                          required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          {reviewState.comment?.length || 0} characters
                        </p>
                      </div>

                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Add Photos (Optional, max 5)
                        </label>

                        <div className="flex flex-wrap gap-3">
                          {reviewState.images?.map((img, index) => (
                            <div key={index} className="relative w-24 h-24 group">
                              <img
                                src={img.preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover rounded-xl border-2 border-pink-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(productId, index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}

                          {(reviewState.images?.length || 0) < 5 && (
                            <label className="w-24 h-24 border-2 border-dashed border-pink-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-all duration-300">
                              <Upload className="w-8 h-8 text-pink-400" />
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => handleImageUpload(productId, e)}
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        onClick={() => submitReview(productId)}
                        disabled={isSubmitting || !reviewState.comment || reviewState.comment.length < 10}
                        className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg ${
                          isSubmitting || !reviewState.comment || reviewState.comment.length < 10
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 hover:shadow-2xl'
                        }`}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/order-list')}
              className="bg-white text-gray-700 px-8 py-3 rounded-2xl hover:bg-gray-100 font-semibold shadow-lg transition-all duration-300 border-2 border-gray-200"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    </>
  );
}