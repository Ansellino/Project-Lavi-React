import React, { useState } from "react";
import { useCart } from "context/CartContext";
import { useUI } from "context/UIContext";

interface AddToCartButtonProps {
  productId: number;
  stock: number;
  className?: string;
  showQuantity?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  stock,
  className = "",
  showQuantity = true,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { showToast } = useUI();

  const handleIncrement = () => {
    if (quantity < stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (stock < 1) {
      showToast("Product is out of stock", "error");
      return;
    }

    setIsAdding(true);
    try {
      addToCart(productId, quantity);
      showToast("Added to cart successfully", "success");
      setQuantity(1); // Reset quantity after adding
    } catch (error) {
      showToast("Failed to add to cart", "error");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {showQuantity && (
        <div className="flex items-center mb-2">
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1 || isAdding}
            className="px-2 py-1 rounded-l bg-secondary-200 text-secondary-800 disabled:opacity-50"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="px-4 py-1 bg-secondary-100 text-secondary-900">
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={quantity >= stock || isAdding}
            className="px-2 py-1 rounded-r bg-secondary-200 text-secondary-800 disabled:opacity-50"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={isAdding || stock < 1}
        className={`px-4 py-2 rounded font-medium transition-colors ${
          stock < 1
            ? "bg-secondary-300 text-secondary-600 cursor-not-allowed"
            : "bg-primary-600 hover:bg-primary-700 text-white"
        }`}
      >
        {isAdding ? (
          <span className="flex items-center justify-center">
            <svg
              className="w-4 h-4 mr-2 -ml-1 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Adding...
          </span>
        ) : stock < 1 ? (
          "Out of Stock"
        ) : (
          "Add to Cart"
        )}
      </button>
    </div>
  );
};

export default AddToCartButton;
