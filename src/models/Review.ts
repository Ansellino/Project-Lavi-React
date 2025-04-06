// src/models/Review.ts
export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  username: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  isVerifiedPurchase: boolean;
}

export interface ReviewSummary {
  average_rating: number;
  total_reviews: number;
  rating_distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}
