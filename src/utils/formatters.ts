/**
 * Utility functions for formatting data throughout the application
 */
import { format, parseISO } from "date-fns";

/**
 * Format a number as currency
 */
export const formatCurrency = (
  amount: number,
  currency = "USD",
  locale = "en-US"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date using date-fns
 */
export const formatDate = (
  date: string | Date,
  formatStr = "MMM d, yyyy"
): string => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

/**
 * Format a date with time
 */
export const formatDateTime = (
  date: string | Date,
  formatStr = "MMM d, yyyy h:mm a"
): string => {
  return formatDate(date, formatStr);
};

/**
 * Format a phone number as (XXX) XXX-XXXX
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return "";

  // Remove all non-digits
  const cleaned = phoneNumber.replace(/\D/g, "");

  // Check if the number has exactly 10 digits
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  // If the number doesn't have exactly 10 digits, return the cleaned version
  return cleaned;
};

/**
 * Format a credit card number with spaces for better readability
 * XXXX XXXX XXXX XXXX
 */
export const formatCardNumber = (cardNumber: string): string => {
  if (!cardNumber) return "";

  // Remove all non-digits
  const cleaned = cardNumber.replace(/\D/g, "");

  // Add a space after every 4 digits
  return cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
};

/**
 * Mask a credit card number except for the last 4 digits
 * e.g. **** **** **** 1234
 */
export const maskCardNumber = (cardNumber: string): string => {
  if (!cardNumber) return "";

  // Remove all non-digits
  const cleaned = cardNumber.replace(/\D/g, "");

  if (cleaned.length < 4) return cleaned;

  // Get the last 4 digits
  const lastFour = cleaned.slice(-4);

  // Replace all but the last 4 digits with asterisks
  const masked = "*".repeat(cleaned.length - 4) + lastFour;

  // Add a space after every 4 characters
  return masked.replace(/(.{4})(?=.)/g, "$1 ");
};

/**
 * Format a postal code (supports US format)
 */
export const formatPostalCode = (postalCode: string): string => {
  if (!postalCode) return "";

  // Remove all non-digits and non-hyphens
  const cleaned = postalCode.replace(/[^\d-]/g, "");

  // Check if it's a 9-digit zip code
  if (cleaned.length > 5 && !cleaned.includes("-")) {
    // Insert hyphen after the fifth digit
    return cleaned.substring(0, 5) + "-" + cleaned.substring(5);
  }

  return cleaned;
};

/**
 * Format a percentage
 */
export const formatPercentage = (value: number, decimalPlaces = 0): string => {
  return `${value.toFixed(decimalPlaces)}%`;
};

/**
 * Truncate text with ellipsis if it exceeds the max length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Format an order number with leading zeros
 */
export const formatOrderNumber = (
  orderNumber: number,
  totalDigits = 6
): string => {
  return `#${orderNumber.toString().padStart(totalDigits, "0")}`;
};

/**
 * Format a full name
 */
export const formatFullName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};

/**
 * Format a full address
 */
export const formatAddress = (address: {
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}): string => {
  const {
    address: street,
    apartment,
    city,
    state,
    postalCode,
    country,
  } = address;

  const line1 = street + (apartment ? `, ${apartment}` : "");
  const line2 = `${city}, ${state} ${postalCode}`;

  return [line1, line2, country].join("\n");
};

/**
 * Format expiry date for credit cards
 */
export const formatExpiryDate = (expiryDate: string): string => {
  if (!expiryDate) return "";

  // Remove all non-digits
  const cleaned = expiryDate.replace(/\D/g, "");

  // Check if we have at least 2 digits
  if (cleaned.length >= 2) {
    const month = cleaned.substring(0, 2);
    const year = cleaned.substring(2);
    return `${month}${year ? "/" + year : ""}`;
  }

  return cleaned;
};
