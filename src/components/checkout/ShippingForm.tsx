import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ShippingFormValues } from "./CheckoutForm";

interface ShippingFormProps {
  onSubmit: (values: ShippingFormValues) => void;
  initialValues?: Partial<ShippingFormValues>;
}

const ShippingForm: React.FC<ShippingFormProps> = ({
  onSubmit,
  initialValues,
}) => {
  const formik = useFormik({
    initialValues: {
      firstName: initialValues?.firstName || "",
      lastName: initialValues?.lastName || "",
      address: initialValues?.address || "",
      apartment: initialValues?.apartment || "",
      city: initialValues?.city || "",
      state: initialValues?.state || "",
      postalCode: initialValues?.postalCode || "",
      country: initialValues?.country || "United States",
      phone: initialValues?.phone || "",
      email: initialValues?.email || "",
      saveAddress: initialValues?.saveAddress || false,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      address: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      postalCode: Yup.string()
        .required("Postal code is required")
        .matches(/^[0-9]{5}(-[0-9]{4})?$/, "Invalid postal code format"),
      country: Yup.string().required("Country is required"),
      phone: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]{10,}$/, "Phone number must have at least 10 digits"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium text-secondary-900">
        Shipping Information
      </h2>
      <p className="mt-1 text-sm text-secondary-600">
        Enter your shipping details to continue with your purchase
      </p>

      <form onSubmit={formik.handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className="form-input"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className="form-input"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="address" className="form-label">
            Street Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            className="form-input"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.address && formik.errors.address && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.address}</p>
          )}
        </div>

        <div>
          <label htmlFor="apartment" className="form-label">
            Apartment, suite, etc. (optional)
          </label>
          <input
            id="apartment"
            name="apartment"
            type="text"
            className="form-input"
            value={formik.values.apartment}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="city" className="form-label">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              className="form-input"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.city && formik.errors.city && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.city}</p>
            )}
          </div>

          <div>
            <label htmlFor="state" className="form-label">
              State / Province
            </label>
            <input
              id="state"
              name="state"
              type="text"
              className="form-input"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.state && formik.errors.state && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.state}</p>
            )}
          </div>

          <div>
            <label htmlFor="postalCode" className="form-label">
              Postal Code
            </label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              className="form-input"
              value={formik.values.postalCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.postalCode && formik.errors.postalCode && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.postalCode}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="country" className="form-label">
            Country
          </label>
          <select
            id="country"
            name="country"
            className="form-input"
            value={formik.values.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Japan">Japan</option>
            <option value="China">China</option>
          </select>
          {formik.touched.country && formik.errors.country && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.country}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="form-input"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
            )}
          </div>
        </div>

        <div className="flex items-center mt-4">
          <input
            id="saveAddress"
            name="saveAddress"
            type="checkbox"
            className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-secondary-300"
            checked={formik.values.saveAddress}
            onChange={formik.handleChange}
          />
          <label
            htmlFor="saveAddress"
            className="ml-2 text-sm text-secondary-700"
          >
            Save this address for future orders
          </label>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Processing..." : "Continue to Payment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;
