import React from "react";
import { CartItem, Product } from "../../models";
import { Link } from "react-router-dom";

interface OrderSummaryProps {
  items: (CartItem & { product: Product })[];
  totalPrice: number;
  isSubmitting: boolean;
  currentStep: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  totalPrice,
  isSubmitting,
  currentStep,
}) => {
  // Calculate additional costs
  const shipping = totalPrice > 100 ? 0 : 10;
  const tax = totalPrice * 0.07; // 7% tax
  const finalTotal = totalPrice + shipping + tax;

  return (
    <div className="sticky p-6 border rounded-lg bg-secondary-50 border-secondary-200 top-6">
      <h2 className="mb-4 text-lg font-medium text-secondary-900">
        Order Summary
      </h2>

      {/* Items list - show compact version */}
      <ul className="mb-6 overflow-auto divide-y divide-secondary-200 max-h-80">
        {items.map((item) => (
          <li key={item.id} className="flex items-center py-3">
            <div className="flex-shrink-0 w-16 h-16 overflow-hidden border rounded-md border-secondary-200">
              {item.product.image ? (
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="object-cover object-center w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-secondary-200">
                  <span className="text-xs text-secondary-500">No image</span>
                </div>
              )}
            </div>
            <div className="flex flex-col flex-1 ml-3">
              <div className="flex justify-between text-sm font-medium">
                <h3
                  className="truncate text-secondary-700"
                  title={item.product.name}
                >
                  {item.product.name}
                </h3>
                <p className="ml-4 text-secondary-900">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <p className="mt-1 text-xs text-secondary-500">
                Qty: {item.quantity} × ${item.product.price.toFixed(2)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Cost breakdown */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-secondary-600">
          <p>Subtotal ({items.length} items)</p>
          <p>${totalPrice.toFixed(2)}</p>
        </div>

        <div className="flex justify-between text-sm text-secondary-600">
          <p>Shipping</p>
          <p>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</p>
        </div>

        <div className="flex justify-between text-sm text-secondary-600">
          <p>Tax (7%)</p>
          <p>${tax.toFixed(2)}</p>
        </div>

        <div className="pt-2 mt-2 border-t border-secondary-200">
          <div className="flex justify-between font-medium text-secondary-900">
            <p>Total</p>
            <p>${finalTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Show different buttons based on checkout step */}
      {currentStep === "confirmation" ? (
        <div className="mt-4 text-sm text-secondary-600">
          <p className="mb-2">
            Your order has been placed successfully. Thank you for your
            purchase!
          </p>
          <div className="flex flex-col gap-2 mt-4">
            <Link to="/orders" className="btn btn-secondary">
              View Your Orders
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          {totalPrice < 100 && (
            <p className="mb-2 text-xs text-secondary-600">
              Add ${(100 - totalPrice).toFixed(2)} more to qualify for free
              shipping!
            </p>
          )}

          {currentStep === "shipping" && (
            <div className="pt-4 mt-2 border-t border-secondary-200">
              <Link
                to="/cart"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                ← Return to cart
              </Link>
            </div>
          )}

          {isSubmitting && (
            <div className="flex justify-center my-3">
              <svg
                className="w-5 h-5 animate-spin text-primary-600"
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
              <span className="ml-2 text-secondary-700">
                Processing your order...
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
