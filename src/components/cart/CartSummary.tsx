import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CartSummary: React.FC = () => {
  const { cartItems, totalPrice, totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  // Calculate shipping, tax, etc.
  const shipping = totalPrice > 100 ? 0 : 10;
  const tax = totalPrice * 0.07; // Example: 7% tax
  const finalTotal = totalPrice + shipping + tax;

  return (
    <div className="p-6 rounded-lg shadow-sm bg-secondary-50">
      <h2 className="mb-4 text-lg font-medium text-secondary-900">
        Order Summary
      </h2>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-secondary-600">
          <p>Subtotal ({totalItems} items)</p>
          <p>${totalPrice.toFixed(2)}</p>
        </div>

        <div className="flex justify-between text-sm text-secondary-600">
          <p>Shipping</p>
          <p>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</p>
        </div>

        <div className="flex justify-between text-sm text-secondary-600">
          <p>Tax</p>
          <p>${tax.toFixed(2)}</p>
        </div>

        <div className="pt-2 mt-2 border-t border-secondary-200">
          <div className="flex justify-between font-medium text-secondary-900">
            <p>Total</p>
            <p>${finalTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={cartItems.length === 0}
        className="w-full px-4 py-2 mt-6 text-white transition-colors rounded bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAuthenticated ? "Proceed to Checkout" : "Sign In to Checkout"}
      </button>

      {totalPrice < 100 && (
        <p className="mt-2 text-xs text-secondary-600">
          Add ${(100 - totalPrice).toFixed(2)} more to qualify for free
          shipping!
        </p>
      )}
    </div>
  );
};

export default CartSummary;
