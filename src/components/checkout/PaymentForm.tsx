import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

interface PaymentFormProps {
  onSubmit: (values: PaymentFormValues) => void;
  onBack: () => void;
}

export interface PaymentFormValues {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  savePaymentMethod: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit, onBack }) => {
  const formik = useFormik({
    initialValues: {
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      savePaymentMethod: false,
    },
    validationSchema: Yup.object({
      cardholderName: Yup.string().required("Cardholder name is required"),
      cardNumber: Yup.string()
        .required("Card number is required")
        .matches(/^[0-9]{16}$/, "Card number must be 16 digits"),
      expiryDate: Yup.string()
        .required("Expiry date is required")
        .matches(
          /^(0[1-9]|1[0-2])\/[0-9]{2}$/,
          "Expiry date must be in MM/YY format"
        ),
      cvv: Yup.string()
        .required("CVV is required")
        .matches(/^[0-9]{3,4}$/, "CVV must be 3 or 4 digits"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium text-secondary-900">Payment Method</h2>
      <p className="mt-1 text-sm text-secondary-600">
        Complete your order by providing your payment details
      </p>

      <form onSubmit={formik.handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="cardholderName" className="form-label">
            Cardholder Name
          </label>
          <input
            id="cardholderName"
            name="cardholderName"
            type="text"
            className="form-input"
            value={formik.values.cardholderName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.cardholderName && formik.errors.cardholderName && (
            <p className="mt-1 text-sm text-red-600">
              {formik.errors.cardholderName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="cardNumber" className="form-label">
            Card Number
          </label>
          <input
            id="cardNumber"
            name="cardNumber"
            type="text"
            placeholder="XXXX XXXX XXXX XXXX"
            className="form-input"
            value={formik.values.cardNumber}
            onChange={(e) => {
              // Only allow numbers and auto-format with spaces
              const value = e.target.value.replace(/\D/g, "").substring(0, 16);
              formik.setFieldValue("cardNumber", value);
            }}
            onBlur={formik.handleBlur}
          />
          {formik.touched.cardNumber && formik.errors.cardNumber && (
            <p className="mt-1 text-sm text-red-600">
              {formik.errors.cardNumber}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiryDate" className="form-label">
              Expiry Date (MM/YY)
            </label>
            <input
              id="expiryDate"
              name="expiryDate"
              type="text"
              placeholder="MM/YY"
              className="form-input"
              value={formik.values.expiryDate}
              onChange={(e) => {
                // Auto-format MM/YY
                let value = e.target.value.replace(/\D/g, "");
                if (value.length > 2) {
                  value = value.substring(0, 2) + "/" + value.substring(2, 4);
                }
                formik.setFieldValue("expiryDate", value);
              }}
              onBlur={formik.handleBlur}
            />
            {formik.touched.expiryDate && formik.errors.expiryDate && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.expiryDate}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="cvv" className="form-label">
              CVV
            </label>
            <input
              id="cvv"
              name="cvv"
              type="text"
              placeholder="XXX"
              className="form-input"
              value={formik.values.cvv}
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value.replace(/\D/g, "").substring(0, 4);
                formik.setFieldValue("cvv", value);
              }}
              onBlur={formik.handleBlur}
            />
            {formik.touched.cvv && formik.errors.cvv && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.cvv}</p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="savePaymentMethod"
            name="savePaymentMethod"
            type="checkbox"
            className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-secondary-300"
            checked={formik.values.savePaymentMethod}
            onChange={formik.handleChange}
          />
          <label
            htmlFor="savePaymentMethod"
            className="ml-2 text-sm text-secondary-700"
          >
            Save this payment method for future purchases
          </label>
        </div>

        <div className="flex justify-between pt-4">
          <button type="button" onClick={onBack} className="btn btn-secondary">
            Back to Shipping
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Processing..." : "Complete Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
