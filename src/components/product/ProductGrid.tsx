import React, { useState } from "react";
import { Product } from "../../models";
import ProductCard from "./ProductCard";
import Spinner from "../common/Spinner";
import SelectInput from "../forms/SelectInput";
import { sortByKey } from "../../utils/helpers";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  error?: string | null;
  title?: string;
  emptyMessage?: string;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  showSorting?: boolean;
  className?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  error = null,
  title,
  emptyMessage = "No products found",
  columns = { sm: 1, md: 3, lg: 4 },
  showSorting = true,
  className = "",
}) => {
  const [sortBy, setSortBy] = useState<string>("name-asc");

  // Sort products based on selected option
  const getSortedProducts = () => {
    const [field, direction] = sortBy.split("-");
    return sortByKey<Product>(
      products,
      field as keyof Product,
      direction as "asc" | "desc"
    );
  };

  const sortedProducts = getSortedProducts();

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  // Generate grid column classes based on props
  const getGridClasses = () => {
    const { sm = 1, md = 3, lg = 4 } = columns;
    return `grid-cols-${sm} md:grid-cols-${md} lg:grid-cols-${lg}`;
  };

  // Error state
  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="max-w-xl p-6 mx-auto border border-red-200 rounded-lg shadow-sm bg-red-50">
          <h2 className="mb-4 text-lg font-medium text-red-700">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Spinner size="lg" />
        <p className="mt-4 text-secondary-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header with title and sorting */}
      <div className="flex flex-col justify-between mb-6 sm:flex-row sm:items-center">
        {title && (
          <h2 className="mb-4 text-2xl font-bold text-secondary-900 sm:mb-0">
            {title}
          </h2>
        )}

        {showSorting && products.length > 0 && (
          <div className="w-full sm:w-48">
            <SelectInput
              name="sortBy"
              label=""
              value={sortBy}
              onChange={handleSortChange}
              options={[
                { value: "name-asc", label: "Name (A-Z)" },
                { value: "name-desc", label: "Name (Z-A)" },
                { value: "price-asc", label: "Price (Low to High)" },
                { value: "price-desc", label: "Price (High to Low)" },
              ]}
              className="mb-0"
            />
          </div>
        )}
      </div>

      {/* Empty state */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg bg-secondary-50">
          <svg
            className="w-16 h-16 mb-4 text-secondary-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="text-secondary-600">{emptyMessage}</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${getGridClasses()}`}>
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
