//review model
const prisma = require("../config/prisma")

class ReviewModels {
  // Create a new review (with purchase verification)
  async createReview(data) {
    const { user_id, product_id, rating, comment } = data;

    // SECURITY CHECK: Verify user can review
    const eligibility = await this.canUserReview(user_id, product_id);
    
    if (!eligibility.canReview) {
      throw new Error(eligibility.reason);
    }

    // Verify product exists
    const product = await prisma.products.findUnique({
      where: { product_id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Create review
    const review = await prisma.reviews.create({
      data: {
        user_id,
        product_id,
        rating,
        comment: comment || null,
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

    const orderBy = sort === 'rating_high'
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

    return {
      reviews,
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
    product_id = parseInt(product_id)
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
            },
            include: {
              images: {
                where: { is_primary: true },
                take: 1,
              },
            },
          },
        },
      }),
      prisma.reviews.count({ where: { user_id } }),
    ]);

    return {
      reviews,
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
    const { rating, comment } = data;

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
        ...(comment !== undefined && { comment }),
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

    return updatedReview;
  }

  // Delete a review (user can delete their own, admin can delete any)
  async deleteReview(review_id, user_id, isAdmin = false) {
    const review = await prisma.reviews.findUnique({
      where: { review_id },
    });

    if (!review) {
      throw new Error('Review not found');
    }

    // Check authorization: owner or admin
    if (!isAdmin && review.user_id !== user_id) {
      throw new Error('Unauthorized to delete this review');
    }

    await prisma.reviews.delete({
      where: { review_id },
    });

    return { message: 'Review deleted successfully' };
  }

  // Get all reviews (admin only - for moderation)
  async getAllReviews(options = {}) {
    const { page = 1, limit = 20, product_id = null, user_id = null, rating = null } = options;
    const skip = (page - 1) * limit;

    const where = {};
    if (product_id) where.product_id = parseInt(product_id);
    if (user_id) where.user_id = parseInt(user_id);
    if (rating) where.rating = parseInt(rating);

    const [reviews, total] = await Promise.all([
      prisma.reviews.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            select: {
              user_id: true,
              username: true,
              first_name: true,
              last_name: true,
              email: true,
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
      }),
      prisma.reviews.count({ where }),
    ]);

    return {
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Check if user can review a product (must have purchased and received it)
  async canUserReview(user_id, product_id) {
    try {
      // Check if user has a delivered order containing this product
      const order = await prisma.orders.findFirst({
        where: {
          user_id,
          status: 'delivered',
          items: {
            some: {
              product_id,
            },
          },
        },
        include: {
          items: {
            where: { product_id },
          },
        },
      });

      if (!order) {
        return { 
          canReview: false, 
          reason: 'You must purchase and receive this product before reviewing' 
        };
      }

      // Check if user has already reviewed this product
      const existingReview = await prisma.reviews.findFirst({
        where: {
          user_id,
          product_id,
        },
      });

      if (existingReview) {
        return { 
          canReview: false, 
          reason: 'You have already reviewed this product' 
        };
      }

      return { 
        canReview: true,
        order_id: order.order_id 
      };
    } catch (error) {
      throw new Error(`Error checking review eligibility: ${error.message}`);
    }
  }
}

module.exports = new ReviewModels();