import React from "react";

interface ReviewStarsProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const ReviewStars: React.FC<ReviewStarsProps> = ({
  rating,
  size = "md",
  className = "",
  interactive = false,
  onChange,
}) => {
  // Calculate full and partial stars
  const fullStars = Math.floor(rating);
  const partialStar = rating % 1;
  const emptyStars = Math.floor(5 - rating);

  // Size classes for stars
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  const handleStarClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className={`flex items-center ${sizeClasses[size]} ${className}`}>
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <span
          key={`full-${i}`}
          className={`text-yellow-400 ${interactive ? "cursor-pointer" : ""}`}
          onClick={() => handleStarClick(i)}
          role={interactive ? "button" : undefined}
          tabIndex={interactive ? 0 : undefined}
          aria-label={interactive ? `Rate ${i + 1} out of 5` : undefined}
        >
          ★
        </span>
      ))}

      {/* Partial star */}
      {partialStar > 0 && (
        <div className="relative">
          {/* Empty star as background */}
          <span className="text-secondary-200">★</span>

          {/* Partial filled star as overlay */}
          <div
            className="absolute top-0 left-0 overflow-hidden text-yellow-400"
            style={{ width: `${partialStar * 100}%` }}
          >
            <span>★</span>
          </div>
        </div>
      )}

      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <span
          key={`empty-${i}`}
          className={`text-secondary-200 ${
            interactive ? "cursor-pointer" : ""
          }`}
          onClick={() =>
            handleStarClick(fullStars + (partialStar > 0 ? 1 : 0) + i)
          }
          role={interactive ? "button" : undefined}
          tabIndex={interactive ? 0 : undefined}
          aria-label={
            interactive
              ? `Rate ${fullStars + (partialStar > 0 ? 1 : 0) + i + 1} out of 5`
              : undefined
          }
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default ReviewStars;
