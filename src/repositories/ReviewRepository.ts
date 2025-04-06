import db from "../database/db";
import { Review, ReviewSummary } from "../models/Review";
import { BaseRepository } from "./BaseRepository";
import { OrderRepository } from "./OrderRepository";

export class ReviewRepository extends BaseRepository<Review> {
  private orderRepository = new OrderRepository();

  constructor() {
    super("review");
  }

  /**
   * Find all reviews for a specific product
   *
   * @param productId Product ID
   * @returns Array of reviews
   */
  findByProductId(productId: number): Review[] {
    return db
      .prepare(
        "SELECT * FROM review WHERE product_id = ? ORDER BY created_at DESC"
      )
      .all(productId) as Review[];
  }

  /**
   * Find all reviews by a specific user
   *
   * @param userId User ID
   * @returns Array of reviews
   */
  findByUserId(userId: number): Review[] {
    return db
      .prepare(
        "SELECT * FROM review WHERE user_id = ? ORDER BY created_at DESC"
      )
      .all(userId) as Review[];
  }

  /**
   * Calculate the average rating for a product
   *
   * @param productId Product ID
   * @returns Average rating (0-5) or 0 if no reviews
   */
  getAverageRatingForProduct(productId: number): number {
    const result = db
      .prepare("SELECT AVG(rating) as average FROM review WHERE product_id = ?")
      .get(productId) as { average: number } | undefined;

    return result?.average || 0;
  }

  /**
   * Get the distribution of ratings (count of each star rating) for a product
   *
   * @param productId Product ID
   * @returns Object with counts for each rating level (1-5)
   */
  getRatingDistributionForProduct(
    productId: number
  ): Record<1 | 2 | 3 | 4 | 5, number> {
    const distribution: Record<1 | 2 | 3 | 4 | 5, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    const results = db
      .prepare(
        "SELECT rating, COUNT(*) as count FROM review WHERE product_id = ? GROUP BY rating"
      )
      .all(productId) as Array<{ rating: 1 | 2 | 3 | 4 | 5; count: number }>;

    results.forEach((result) => {
      distribution[result.rating] = result.count;
    });

    return distribution;
  }

  /**
   * Get complete review summary for a product
   *
   * @param productId Product ID
   * @returns ReviewSummary object with average, total and distribution
   */
  getReviewSummaryForProduct(productId: number): ReviewSummary {
    const total_reviews = this.count();
    const average_rating = this.getAverageRatingForProduct(productId);
    const rating_distribution = this.getRatingDistributionForProduct(productId);

    return {
      average_rating,
      total_reviews,
      rating_distribution,
    };
  }

  /**
   * Check if a user has verified purchase of a product
   *
   * @param userId User ID
   * @param productId Product ID
   * @returns True if user has purchased the product
   */
  isVerifiedPurchase(userId: number, productId: number): boolean {
    const userOrders = this.orderRepository.findByUserId(userId);

    for (const order of userOrders) {
      const orderItems = this.orderRepository.getOrderItems(order.id);
      if (orderItems.some((item) => item.product_id === productId)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Create a new review with verification
   *
   * @param reviewData Review data without ID and created_at
   * @returns Created review
   */
  createReview(reviewData: Omit<Review, "id" | "created_at">): Review {
    const isVerified = this.isVerifiedPurchase(
      reviewData.user_id,
      reviewData.product_id
    );

    return this.create({
      ...reviewData,
      isVerifiedPurchase: isVerified,
    });
  }

  /**
   * Check if user has already reviewed a product
   *
   * @param userId User ID
   * @param productId Product ID
   * @returns True if user has already reviewed the product
   */
  hasUserReviewedProduct(userId: number, productId: number): boolean {
    const result = db
      .prepare(
        "SELECT COUNT(*) as count FROM review WHERE user_id = ? AND product_id = ?"
      )
      .get(userId, productId) as { count: number };

    return result.count > 0;
  }

  /**
   * Get most recent reviews (across all products)
   *
   * @param limit Number of reviews to fetch
   * @returns Array of recent reviews
   */
  getRecentReviews(limit: number = 10): Review[] {
    return db
      .prepare(`SELECT * FROM review ORDER BY created_at DESC LIMIT ?`)
      .all(limit) as Review[];
  }

  /**
   * Get most helpful reviews for a product based on helpfulness votes
   *
   * @param productId Product ID
   * @param limit Number of reviews to fetch
   * @returns Array of helpful reviews
   */
  getHelpfulReviews(productId: number, limit: number = 5): Review[] {
    // This assumes there's a helpfulness_score field in the review table
    // If you don't have this yet, you'd need to add it or implement a different sorting method
    return db
      .prepare(
        `
        SELECT * FROM review 
        WHERE product_id = ? 
        ORDER BY helpfulness_score DESC, created_at DESC 
        LIMIT ?
      `
      )
      .all(productId, limit) as Review[];
  }
}
