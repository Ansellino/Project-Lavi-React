import React, { useState } from "react";
import { Product } from "../../models";
import Badge from "../common/Badge";
import Spinner from "../common/Spinner";

interface ProductImageProps {
  product?: Product;
  src?: string;
  alt?: string;
  className?: string;
  aspectRatio?: "square" | "4:3" | "16:9" | "auto";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showStockBadge?: boolean;
  enableZoom?: boolean;
  rounded?: boolean;
  fallbackText?: string;
  onClick?: () => void;
}

const ProductImage: React.FC<ProductImageProps> = ({
  product,
  src,
  alt,
  className = "",
  aspectRatio = "square",
  size = "md",
  showStockBadge = false,
  enableZoom = false,
  rounded = true,
  fallbackText = "No image available",
  onClick,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Determine the image source - either from direct src prop or from product
  const imageSrc = src || product?.image || "";
  const imageAlt = alt || product?.name || "Product image";

  // Stock status (if product is provided)
  const isOutOfStock = product ? product.stock <= 0 : false;
  const isLowStock = product ? product.stock > 0 && product.stock <= 5 : false;

  // Handle image load success
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Handle image load error
  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Size classes
  const sizeClasses = {
    sm: "h-24 w-24",
    md: "h-40 w-40",
    lg: "h-64 w-64",
    xl: "h-80 w-80",
    full: "h-full w-full",
  };

  // Aspect ratio classes
  const aspectRatioClasses = {
    square: "aspect-square",
    "4:3": "aspect-[4/3]",
    "16:9": "aspect-[16/9]",
    auto: "",
  };

  return (
    <div
      className={`
        relative overflow-hidden bg-secondary-100
        ${rounded ? "rounded-lg" : ""}
        ${aspectRatioClasses[aspectRatio]}
        ${size !== "full" ? sizeClasses[size] : "h-full w-full"}
        ${enableZoom ? "group cursor-pointer" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary-100">
          <Spinner size="md" />
        </div>
      )}

      {/* Image */}
      {imageSrc && !hasError ? (
        <img
          src={imageSrc}
          alt={imageAlt}
          className={`
            object-cover object-center w-full h-full
            ${isLoading ? "opacity-0" : "opacity-100"}
            transition-opacity duration-300
            ${
              enableZoom
                ? "transition-transform duration-300 group-hover:scale-110"
                : ""
            }
          `}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      ) : (
        /* Fallback for no image or error */
        <div className="flex items-center justify-center w-full h-full text-center">
          <span className="text-sm text-secondary-400">{fallbackText}</span>
        </div>
      )}

      {/* Stock badges */}
      {showStockBadge && product && (
        <>
          {isOutOfStock && (
            <Badge variant="error" className="absolute top-2 right-2">
              Out of Stock
            </Badge>
          )}

          {isLowStock && (
            <Badge variant="warning" className="absolute top-2 right-2">
              Low Stock
            </Badge>
          )}
        </>
      )}
    </div>
  );
};

export default ProductImage;
