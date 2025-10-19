const prisma = require("../config/prisma")

class ReviewModels {
  // Create a new review
  async createReview(data) {
    const { user_id, product_id, order_id, rating, title, comment, images } = data;

    // Check if user has already reviewed this product for this order
    if (order_id) {
      const existingReview = await prisma.reviews.findUnique({
        where: {
          user_id_product_id_order_id: {
            user_id,
            product_id,
            order_id,
          },
        },
      });

      if (existingReview) {
        throw new Error('You have already reviewed this product for this order');
      }
    }

    // Verify product exists
    const product = await prisma.products.findUnique({
      where: { product_id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // If order_id provided, verify order belongs to user and contains the product
    let is_verified = false;
    if (order_id) {
      const order = await prisma.orders.findFirst({
        where: {
          order_id,
          user_id,
          status: 'delivered', // Only allow reviews for delivered orders
        },
        include: {
          items: {
            where: { product_id },
          },
        },
      });

      if (!order) {
        throw new Error('Order not found or not eligible for review');
      }

      if (order.items.length === 0) {
        throw new Error('Product not found in this order');
      }

      is_verified = true; // Verified purchase
    }

    // Create review
    const review = await prisma.reviews.create({
      data: {
        user_id,
        product_id,
        order_id: order_id || null,
        rating,
        title: title || null,
        comment: comment || null,
        images: images ? JSON.stringify(images) : null,
        is_verified,
      },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            first_name: true,
            last_name: true,
            profile_image_url: true,
          },
        },
        product: {
          select: {
            product_id: true,
            name: true,
          },
        },
      },
    });

    return review;
  }

  // Get reviews for a product
  async getProductReviews(product_id, options = {}) {
    const { page = 1, limit = 10, rating = null, sort = 'recent' } = options;
    const skip = (page - 1) * limit;

    const where = {
      product_id,
      ...(rating && { rating: parseInt(rating) }),
    };

    const orderBy = sort === 'helpful' 
      ? { created_at: 'desc' } // Can add helpful_count field later
      : sort === 'rating_high'
      ? { rating: 'desc' }
      : sort === 'rating_low'
      ? { rating: 'asc' }
      : { created_at: 'desc' }; // default: recent

    const [reviews, total] = await Promise.all([
      prisma.reviews.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: {
            select: {
              user_id: true,
              username: true,
              first_name: true,
              last_name: true,
              profile_image_url: true,
            },
          },
        },
      }),
      prisma.reviews.count({ where }),
    ]);

    // Parse images JSON
    const parsedReviews = reviews.map(review => ({
      ...review,
      images: review.images ? JSON.parse(review.images) : [],
    }));

    return {
      reviews: parsedReviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get review statistics for a product
  async getProductReviewStats(product_id) {
    const reviews = await prisma.reviews.findMany({
      where: { product_id },
      select: { rating: true },
    });

    const totalReviews = reviews.length;
    if (totalReviews === 0) {
      return {
        average_rating: 0,
        total_reviews: 0,
        rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const sumRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = sumRating / totalReviews;

    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      ratingDistribution[r.rating]++;
    });

    return {
      average_rating: parseFloat(averageRating.toFixed(2)),
      total_reviews: totalReviews,
      rating_distribution: ratingDistribution,
    };
  }

  // Get user's reviews
  async getUserReviews(user_id, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.reviews.findMany({
        where: { user_id },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          product: {
            select: {
              product_id: true,
              name: true,
              image_url: true,
            },
          },
        },
      }),
      prisma.reviews.count({ where: { user_id } }),
    ]);

    const parsedReviews = reviews.map(review => ({
      ...review,
      images: review.images ? JSON.parse(review.images) : [],
    }));

    return {
      reviews: parsedReviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Update a review
  async updateReview(review_id, user_id, data) {
    const { rating, title, comment, images } = data;

    const existingReview = await prisma.reviews.findUnique({
      where: { review_id },
    });

    if (!existingReview) {
      throw new Error('Review not found');
    }

    if (existingReview.user_id !== user_id) {
      throw new Error('Unauthorized to update this review');
    }

    const updatedReview = await prisma.reviews.update({
      where: { review_id },
      data: {
        ...(rating && { rating }),
        ...(title !== undefined && { title }),
        ...(comment !== undefined && { comment }),
        ...(images !== undefined && { images: images ? JSON.stringify(images) : null }),
      },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            first_name: true,
            last_name: true,
            profile_image_url: true,
          },
        },
        product: {
          select: {
            product_id: true,
            name: true,
          },
        },
      },
    });

    return {
      ...updatedReview,
      images: updatedReview.images ? JSON.parse(updatedReview.images) : [],
    };
  }

  // Delete a review
  async deleteReview(review_id, user_id) {
    const review = await prisma.reviews.findUnique({
      where: { review_id },
    });

    if (!review) {
      throw new Error('Review not found');
    }

    if (review.user_id !== user_id) {
      throw new Error('Unauthorized to delete this review');
    }

    await prisma.reviews.delete({
      where: { review_id },
    });

    return { message: 'Review deleted successfully' };
  }

  // Check if user can review a product
  async canUserReview(user_id, product_id, order_id = null) {
    if (order_id) {
      const order = await prisma.orders.findFirst({
        where: {
          order_id,
          user_id,
          status: 'delivered',
        },
        include: {
          items: {
            where: { product_id },
          },
        },
      });

      if (!order || order.items.length === 0) {
        return { canReview: false, reason: 'Order not eligible for review' };
      }

      const existingReview = await prisma.reviews.findUnique({
        where: {
          user_id_product_id_order_id: {
            user_id,
            product_id,
            order_id,
          },
        },
      });

      if (existingReview) {
        return { canReview: false, reason: 'Already reviewed' };
      }

      return { canReview: true };
    }

    return { canReview: true };
  }
}

module.exports = new ReviewModels();