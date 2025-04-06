import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = "",
}) => {
  // Don't render if there's only one page
  if (totalPages <= 1) return null;

  // Calculate the range of page numbers to show
  const getPageNumbers = () => {
    // Always show first and last page
    // And show siblingCount pages before and after current page
    const totalPageNumbers = siblingCount * 2 + 3; // siblings + current + first + last

    // If we can show all pages without dots
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    // First page is always shown
    const firstPageIndex = 1;
    // Last page is always shown
    const lastPageIndex = totalPages;

    // No left dots, but right dots
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "...", totalPages];
    }

    // No right dots, but left dots
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [firstPageIndex, "...", ...rightRange];
    }

    // Both left and right dots
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }

    return [];
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      className={`flex justify-center mt-8 ${className}`}
      aria-label="Pagination"
    >
      <ul className="inline-flex -space-x-px">
        {/* Previous button */}
        <li>
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 ml-0 leading-tight border rounded-l-lg 
              ${
                currentPage === 1
                  ? "text-secondary-400 cursor-not-allowed bg-secondary-50 border-secondary-300"
                  : "text-secondary-700 bg-white border-secondary-300 hover:bg-secondary-100 hover:text-secondary-800"
              }`}
            aria-label="Previous page"
          >
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>

        {/* Page numbers */}
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === "...") {
            return (
              <li key={`ellipsis-${index}`}>
                <span className="px-3 py-2 leading-tight bg-white border text-secondary-500 border-secondary-300">
                  &hellip;
                </span>
              </li>
            );
          }

          return (
            <li key={`page-${pageNumber}`}>
              <button
                onClick={() => onPageChange(pageNumber as number)}
                className={`px-3 py-2 leading-tight border
                  ${
                    currentPage === pageNumber
                      ? "z-10 text-white bg-primary-600 border-primary-600"
                      : "text-secondary-700 bg-white border-secondary-300 hover:bg-secondary-100 hover:text-secondary-800"
                  }`}
                aria-current={currentPage === pageNumber ? "page" : undefined}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}

        {/* Next button */}
        <li>
          <button
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
            disabled={currentPage === totalPages}
            className={`px-3 py-2 leading-tight border rounded-r-lg 
              ${
                currentPage === totalPages
                  ? "text-secondary-400 cursor-not-allowed bg-secondary-50 border-secondary-300"
                  : "text-secondary-700 bg-white border-secondary-300 hover:bg-secondary-100 hover:text-secondary-800"
              }`}
            aria-label="Next page"
          >
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
