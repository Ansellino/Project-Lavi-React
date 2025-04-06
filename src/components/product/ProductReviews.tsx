import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import { formatDate } from "../../utils/formatters";
import { sortByKey } from "../../utils/helpers";
import { PAGINATION } from "../../utils/constants";
import Spinner from "../common/Spinner";
import SelectInput from "../forms/SelectInput";
import TextArea from "../forms/TextArea";
import ReviewStars from "./ReviewStars";

// Review data structure
export interface Review {
  id: number;
  productId: number;
  userId: number;
  username: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  isVerifiedPurchase: boolean;
}

interface ProductReviewsProps {
  productId: number;
  className?: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  className = "",
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isWritingReview, setIsWritingReview] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const { showToast } = useUI();

  const itemsPerPage = PAGINATION.DEFAULT_PAGE_SIZE;

  // Fetch product reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);

        // This would be an API call in a real application
        // For now, we'll simulate a delay and return mock data
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock data for demonstration
        const mockReviews: Review[] = [
          {
            id: 1,
            productId,
            userId: 1,
            username: "JohnDoe",
            rating: 5,
            title: "Great product!",
            comment:
              "This product exceeded my expectations. The quality is excellent and it works perfectly.",
            createdAt: new Date(
              Date.now() - 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
            isVerifiedPurchase: true,
          },
          {
            id: 2,
            productId,
            userId: 2,
            username: "JaneSmith",
            rating: 4,
            title: "Good value for money",
            comment:
              "I'm satisfied with this purchase. It's not perfect but definitely worth the price.",
            createdAt: new Date(
              Date.now() - 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
            isVerifiedPurchase: true,
          },
          {
            id: 3,
            productId,
            userId: 3,
            username: "RobertJohnson",
            rating: 3,
            title: "Decent but could be improved",
            comment:
              "The product is okay but there's definitely room for improvement. Some features don't work as expected.",
            createdAt: new Date(
              Date.now() - 14 * 24 * 60 * 60 * 1000
            ).toISOString(),
            isVerifiedPurchase: false,
          },
        ];

        setReviews(mockReviews);
        setError(null);
      } catch (err) {
        setError("Failed to load reviews");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  // Sort reviews based on selected option
  const getSortedReviews = () => {
    switch (sortBy) {
      case "highest":
        return sortByKey(reviews, "rating", "desc");
      case "lowest":
        return sortByKey(reviews, "rating", "asc");
      case "oldest":
        return sortByKey(reviews, "createdAt", "asc");
      case "newest":
      default:
        return sortByKey(reviews, "createdAt", "desc");
    }
  };

  // Calculate average rating
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  // Get rating distribution (for the rating breakdown)
  const getRatingDistribution = () => {
    const distribution: Record<1 | 2 | 3 | 4 | 5, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    reviews.forEach((review) => {
      // Ensure rating is between 1-5 and is a valid key for our distribution object
      const rating = Math.min(Math.max(Math.round(review.rating), 1), 5) as
        | 1
        | 2
        | 3
        | 4
        | 5;
      distribution[rating]++;
    });

    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  // Handle form submission for new review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast("Please log in to submit a review", "info");
      return;
    }

    try {
      setSubmitting(true);

      // Validate inputs
      if (!newReview.title.trim()) {
        showToast("Please add a title for your review", "error");
        return;
      }

      if (!newReview.comment.trim()) {
        showToast("Please write your review", "error");
        return;
      }

      // Here we would make an API call to save the review
      // For demonstration, we'll simulate a delay and add the review locally
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newReviewData: Review = {
        id: reviews.length + 1,
        productId,
        userId: user?.id || 0,
        username: user?.name || "Anonymous",
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        createdAt: new Date().toISOString(),
        isVerifiedPurchase: true,
      };

      setReviews([newReviewData, ...reviews]);

      // Reset form
      setNewReview({
        rating: 5,
        title: "",
        comment: "",
      });

      setIsWritingReview(false);
      showToast("Review submitted successfully", "success");
    } catch (err) {
      showToast("Failed to submit review", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const paginatedReviews = getSortedReviews().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: document.getElementById("reviews-section")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  // If loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Spinner size="lg" />
        <p className="mt-4 text-secondary-600">Loading reviews...</p>
      </div>
    );
  }

  // If error
  if (error) {
    return (
      <div className="max-w-3xl p-6 mx-auto border border-red-200 rounded-lg bg-red-50">
        <h3 className="mb-2 text-lg font-medium text-red-700">
          Error loading reviews
        </h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div id="reviews-section" className={`mt-12 ${className}`}>
      <h2 className="mb-8 text-2xl font-bold text-secondary-900">
        Customer Reviews
      </h2>

      {/* Rating Summary */}
      <div className="grid gap-8 mb-8 md:grid-cols-2">
        <div>
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-2">
              <ReviewStars rating={averageRating} size="lg" />
            </div>
            <span className="text-lg font-bold text-secondary-900">
              {averageRating.toFixed(1)} out of 5
            </span>
          </div>

          <p className="mb-4 text-secondary-600">
            Based on {reviews.length}{" "}
            {reviews.length === 1 ? "review" : "reviews"}
          </p>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <div className="w-20">
                  <span className="text-sm text-secondary-600">
                    {rating} star
                  </span>
                </div>
                <div className="flex-grow h-4 mx-4 rounded-full bg-secondary-200">
                  <div
                    className="h-4 rounded-full bg-primary-500"
                    style={{
                      width: reviews.length
                        ? `${
                            (ratingDistribution[rating as 1 | 2 | 3 | 4 | 5] /
                              reviews.length) *
                            100
                          }%`
                        : "0%",
                    }}
                  ></div>
                </div>
                <div className="w-10 text-right">
                  <span className="text-sm text-secondary-600">
                    {reviews.length
                      ? Math.round(
                          (ratingDistribution[rating as 1 | 2 | 3 | 4 | 5] /
                            reviews.length) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          {isWritingReview ? (
            <form
              onSubmit={handleSubmitReview}
              className="p-6 border rounded-lg border-secondary-200"
            >
              <h3 className="mb-4 text-lg font-medium text-secondary-900">
                Write a Review
              </h3>

              <div className="mb-4">
                <label className="block mb-2 form-label">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      className="text-2xl focus:outline-none"
                      onClick={() =>
                        setNewReview((prev) => ({ ...prev, rating }))
                      }
                    >
                      <span
                        className={
                          rating <= newReview.rating
                            ? "text-yellow-400"
                            : "text-secondary-300"
                        }
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="review-title" className="block mb-2 form-label">
                  Title
                </label>
                <input
                  type="text"
                  id="review-title"
                  className="w-full form-input"
                  placeholder="Summarize your review"
                  value={newReview.title}
                  onChange={(e) =>
                    setNewReview((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="review-comment"
                  className="block mb-2 form-label"
                >
                  Review
                </label>
                <TextArea
                  name="review-comment"
                  label="Review"
                  rows={4}
                  className="w-full"
                  placeholder="What did you like or dislike about this product?"
                  value={newReview.comment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewReview((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 btn btn-secondary"
                  onClick={() => setIsWritingReview(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center p-6 text-center border rounded-lg border-secondary-200">
              <h3 className="mb-3 text-lg font-medium text-secondary-900">
                Share your thoughts
              </h3>
              <p className="mb-6 text-secondary-600">
                Help other customers make their decision
              </p>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    showToast("Please log in to write a review", "info");
                    return;
                  }
                  setIsWritingReview(true);
                }}
                className="px-4 py-2 btn btn-primary"
              >
                Write a Review
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review Sorting */}
      {reviews.length > 0 && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-secondary-900">
            {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
          </h3>

          <div className="w-48">
            <SelectInput
              name="sortReviews"
              label=""
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: "newest", label: "Newest First" },
                { value: "oldest", label: "Oldest First" },
                { value: "highest", label: "Highest Rated" },
                { value: "lowest", label: "Lowest Rated" },
              ]}
              className="mb-0"
            />
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {paginatedReviews.map((review) => (
            <div
              key={review.id}
              className="p-6 border rounded-lg border-secondary-200"
            >
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <ReviewStars rating={review.rating} />
                  <h4 className="ml-2 text-lg font-medium text-secondary-900">
                    {review.title}
                  </h4>
                </div>
                <span className="text-sm text-secondary-500">
                  {formatDate(review.createdAt)}
                </span>
              </div>

              <div className="flex items-center mb-3">
                <span className="text-sm font-medium text-secondary-700">
                  {review.username}
                </span>
                {review.isVerifiedPurchase && (
                  <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                    Verified Purchase
                  </span>
                )}
              </div>

              <p className="text-secondary-600">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center border rounded-lg border-secondary-200">
          <h3 className="mb-2 text-lg font-medium text-secondary-900">
            No reviews yet
          </h3>
          <p className="mb-6 text-secondary-600">
            Be the first to share your experience with this product
          </p>
          <button
            onClick={() => {
              if (!isAuthenticated) {
                showToast("Please log in to write a review", "info");
                return;
              }
              setIsWritingReview(true);
            }}
            className="px-4 py-2 btn btn-primary"
          >
            Write a Review
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-8">
          <nav
            className="inline-flex -space-x-px rounded-md shadow-sm isolate"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium bg-white border rounded-l-md border-secondary-300 text-secondary-500 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border border-secondary-300 ${
                  currentPage === index + 1
                    ? "z-10 bg-primary-50 border-primary-500 text-primary-600"
                    : "bg-white text-secondary-500 hover:bg-secondary-50"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium bg-white border rounded-r-md border-secondary-300 text-secondary-500 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
