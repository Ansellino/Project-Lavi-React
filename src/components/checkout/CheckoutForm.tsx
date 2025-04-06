import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useUI } from "../../context/UIContext";
import PaymentForm, { PaymentFormValues } from "./PaymentForm";
import ShippingForm from "./ShippingForm";
import OrderSummary from "./OrderSummary";

export interface ShippingFormValues {
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  saveAddress: boolean;
}

interface OrderData {
  shipping: ShippingFormValues;
  payment: PaymentFormValues;
  items: any[]; // Replace with your cart item type
  totalAmount: number;
}

enum CheckoutStep {
  SHIPPING = "shipping",
  PAYMENT = "payment",
  CONFIRMATION = "confirmation",
}

const CheckoutForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(
    CheckoutStep.SHIPPING
  );
  const [orderData, setOrderData] = useState<Partial<OrderData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cartItems, totalPrice, clearCart } = useCart();
  const { showToast } = useUI();
  const navigate = useNavigate();

  const handleShippingSubmit = (values: ShippingFormValues) => {
    setOrderData((prev) => ({ ...prev, shipping: values }));
    setCurrentStep(CheckoutStep.PAYMENT);
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = async (values: PaymentFormValues) => {
    setIsSubmitting(true);

    try {
      // Combine all order data
      const completeOrderData: OrderData = {
        shipping: orderData.shipping as ShippingFormValues,
        payment: values,
        items: cartItems,
        totalAmount: totalPrice,
      };

      // Simulate API call to create order
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success handling
      clearCart();
      showToast("Order placed successfully!", "success");

      // Store order data for confirmation page
      setOrderData(completeOrderData);
      setCurrentStep(CheckoutStep.CONFIRMATION);
      window.scrollTo(0, 0);
    } catch (error) {
      showToast("Failed to process order. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToShipping = () => {
    setCurrentStep(CheckoutStep.SHIPPING);
    window.scrollTo(0, 0);
  };

  const handleBackToShopping = () => {
    navigate("/products");
  };

  // Prevent accessing checkout with empty cart
  if (cartItems.length === 0 && currentStep !== CheckoutStep.CONFIRMATION) {
    return (
      <div className="py-12 text-center">
        <h2 className="mb-4 text-2xl font-semibold text-secondary-900">
          Your cart is empty
        </h2>
        <p className="mb-6 text-secondary-600">
          Add some items to your cart before proceeding to checkout.
        </p>
        <button onClick={handleBackToShopping} className="btn btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="py-8">
        {/* Checkout progress indicator */}
        <nav className="mb-8">
          <ol className="flex items-center">
            <li
              className={`flex-1 ${
                currentStep === CheckoutStep.SHIPPING
                  ? "text-primary-600"
                  : "text-secondary-500"
              }`}
            >
              <span className="font-medium">1. Shipping</span>
            </li>
            <li
              className={`flex-1 ${
                currentStep === CheckoutStep.PAYMENT
                  ? "text-primary-600"
                  : "text-secondary-500"
              }`}
            >
              <span className="font-medium">2. Payment</span>
            </li>
            <li
              className={`flex-1 ${
                currentStep === CheckoutStep.CONFIRMATION
                  ? "text-primary-600"
                  : "text-secondary-500"
              }`}
            >
              <span className="font-medium">3. Confirmation</span>
            </li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Main form area */}
          <div className="lg:col-span-7">
            {currentStep === CheckoutStep.SHIPPING && (
              <ShippingForm onSubmit={handleShippingSubmit} />
            )}

            {currentStep === CheckoutStep.PAYMENT && (
              <PaymentForm
                onSubmit={handlePaymentSubmit}
                onBack={handleBackToShipping}
              />
            )}

            {currentStep === CheckoutStep.CONFIRMATION && (
              <div className="p-6 card">
                <h2 className="mb-4 text-xl font-medium text-secondary-900">
                  Order Confirmation
                </h2>
                <p className="mb-2 text-secondary-600">
                  Thank you for your order! We've sent a confirmation email to{" "}
                  {orderData.shipping?.email}.
                </p>
                <p className="mb-6 text-secondary-600">
                  Your order number is:{" "}
                  <span className="font-semibold">
                    #{Math.floor(Math.random() * 100000)}
                  </span>
                </p>

                <div className="pt-4 mt-4 border-t border-secondary-200">
                  <h3 className="mb-2 text-lg font-medium text-secondary-900">
                    Shipping Address
                  </h3>
                  <address className="not-italic text-secondary-600">
                    {orderData.shipping?.firstName}{" "}
                    {orderData.shipping?.lastName}
                    <br />
                    {orderData.shipping?.address}
                    {orderData.shipping?.apartment
                      ? `, ${orderData.shipping.apartment}`
                      : ""}
                    <br />
                    {orderData.shipping?.city}, {orderData.shipping?.state}{" "}
                    {orderData.shipping?.postalCode}
                    <br />
                    {orderData.shipping?.country}
                    <br />
                    {orderData.shipping?.phone}
                  </address>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleBackToShopping}
                    className="w-full btn btn-primary"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="mt-8 lg:col-span-5 lg:mt-0">
            <OrderSummary
              items={cartItems}
              totalPrice={totalPrice}
              isSubmitting={isSubmitting}
              currentStep={currentStep}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
