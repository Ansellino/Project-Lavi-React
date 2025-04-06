/**
 * Utility functions for validation throughout the application
 * Can be used standalone or with Formik/Yup
 */
import * as Yup from "yup";
import { FORM } from "./constants";

// -------------------------
// Basic Validators
// -------------------------

/**
 * Check if a value is empty (null, undefined, empty string)
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

/**
 * Check if a value is a valid email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if a string is a valid phone number (at least 10 digits)
 */
export const isValidPhone = (phone: string): boolean => {
  return FORM.VALIDATION.PHONE_REGEX.test(phone.replace(/\D/g, ""));
};

/**
 * Check if a string is a valid postal code (US format)
 */
export const isValidPostalCode = (postalCode: string): boolean => {
  return FORM.VALIDATION.POSTAL_CODE_REGEX.test(postalCode);
};

/**
 * Check if a string has a minimum length
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

/**
 * Check if a string has a maximum length
 */
export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

// -------------------------
// Payment Validators
// -------------------------

/**
 * Check if a string is a valid credit card number (16 digits)
 */
export const isValidCardNumber = (cardNumber: string): boolean => {
  return FORM.VALIDATION.CARD_NUMBER_REGEX.test(cardNumber.replace(/\D/g, ""));
};

/**
 * Check if a string is a valid expiry date (MM/YY format)
 */
export const isValidExpiryDate = (expiryDate: string): boolean => {
  if (!FORM.VALIDATION.EXPIRY_DATE_REGEX.test(expiryDate)) {
    return false;
  }

  // Check if the card is not expired
  const [month, year] = expiryDate.split("/");
  const expiryMonth = parseInt(month, 10);
  const expiryYear = parseInt("20" + year, 10);

  const now = new Date();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-based
  const currentYear = now.getFullYear();

  if (expiryYear < currentYear) {
    return false;
  }

  if (expiryYear === currentYear && expiryMonth < currentMonth) {
    return false;
  }

  return true;
};

/**
 * Check if a string is a valid CVV (3-4 digits)
 */
export const isValidCVV = (cvv: string): boolean => {
  return FORM.VALIDATION.CVV_REGEX.test(cvv);
};

/**
 * Check if a card is potentially valid using basic Luhn algorithm
 */
export const isValidLuhn = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\D/g, "");

  if (digits.length !== 16) return false;

  let sum = 0;
  let shouldDouble = false;

  // Loop through from right to left
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

// -------------------------
// Password Validators
// -------------------------

/**
 * Check if a password meets minimum requirements
 * (at least 8 characters, including a number and a special character)
 */
export const isStrongPassword = (password: string): boolean => {
  const hasMinChars = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return hasMinChars && hasNumber && hasSpecial;
};

/**
 * Check password strength and return a score (0-4)
 * 0 = Very Weak, 1 = Weak, 2 = Medium, 3 = Strong, 4 = Very Strong
 */
export const getPasswordStrength = (password: string): number => {
  if (!password) return 0;

  let score = 0;

  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Complexity checks
  if (/[0-9]/.test(password)) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

  return Math.min(4, Math.floor(score * 0.8));
};

// -------------------------
// Yup Schema Builders
// -------------------------

/**
 * Common Yup schemas that can be used in Formik forms
 */
export const YupSchemas = {
  /**
   * Schema for user authentication
   */
  auth: {
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/\d/, "Password must contain at least one number")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      )
      .required("Password is required"),
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
  },

  /**
   * Schema for user profile
   */
  profile: {
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    phone: Yup.string()
      .matches(
        FORM.VALIDATION.PHONE_REGEX,
        "Phone number must have at least 10 digits"
      )
      .required("Phone number is required"),
  },

  /**
   * Schema for shipping address
   */
  address: {
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    postalCode: Yup.string()
      .matches(FORM.VALIDATION.POSTAL_CODE_REGEX, "Invalid postal code format")
      .required("Postal code is required"),
    country: Yup.string().required("Country is required"),
  },

  /**
   * Schema for payment information
   */
  payment: {
    cardholderName: Yup.string().required("Cardholder name is required"),
    cardNumber: Yup.string()
      .matches(
        FORM.VALIDATION.CARD_NUMBER_REGEX,
        "Card number must be 16 digits"
      )
      .required("Card number is required"),
    expiryDate: Yup.string()
      .matches(
        FORM.VALIDATION.EXPIRY_DATE_REGEX,
        "Expiry date must be in MM/YY format"
      )
      .required("Expiry date is required")
      .test("expiry-date", "Card has expired", isValidExpiryDate),
    cvv: Yup.string()
      .matches(FORM.VALIDATION.CVV_REGEX, "CVV must be 3 or 4 digits")
      .required("CVV is required"),
  },
};

/**
 * Create a shipping form validation schema
 */
export const createShippingFormSchema = () => {
  return Yup.object({
    ...YupSchemas.profile,
    ...YupSchemas.address,
    email: YupSchemas.auth.email,
    apartment: Yup.string(),
    saveAddress: Yup.boolean(),
  });
};

/**
 * Create a payment form validation schema
 */
export const createPaymentFormSchema = () => {
  return Yup.object({
    ...YupSchemas.payment,
    savePaymentMethod: Yup.boolean(),
  });
};

/**
 * Create a registration form validation schema
 */
export const createRegistrationFormSchema = () => {
  return Yup.object({
    username: YupSchemas.auth.username,
    email: YupSchemas.auth.email,
    password: YupSchemas.auth.password,
    confirmPassword: YupSchemas.auth.confirmPassword,
  });
};

/**
 * Create a login form validation schema
 */
export const createLoginFormSchema = () => {
  return Yup.object({
    email: YupSchemas.auth.email,
    password: Yup.string().required("Password is required"),
  });
};
