/**
 * Application-wide constants
 */

// API Endpoints
export const API = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  PRODUCTS: "/products",
  CATEGORIES: "/categories",
  CART: "/cart",
  ORDERS: "/orders",
  USERS: "/users",
  AUTH: "/auth",
};

// Authentication
export const AUTH = {
  TOKEN_KEY: "auth_token",
  USER_KEY: "user",
  ROLES: {
    ADMIN: "admin",
    CUSTOMER: "customer",
  },
};

// UI Constants
export const UI = {
  TOAST_DURATION: 5000, // milliseconds
  TOAST_TYPES: {
    SUCCESS: "success",
    ERROR: "error",
    INFO: "info",
    WARNING: "warning",
  },
  MODAL_SIZES: {
    SM: "sm",
    MD: "md",
    LG: "lg",
    XL: "xl",
    FULL: "full",
  },
  DROPDOWN_ALIGN: {
    LEFT: "left",
    RIGHT: "right",
  },
  DROPDOWN_WIDTH: {
    AUTO: "auto",
    FULL: "full",
  },
};

// Form Constants
export const FORM = {
  VALIDATION: {
    PHONE_REGEX: /^[0-9]{10,}$/,
    POSTAL_CODE_REGEX: /^[0-9]{5}(-[0-9]{4})?$/,
    CARD_NUMBER_REGEX: /^[0-9]{16}$/,
    CVV_REGEX: /^[0-9]{3,4}$/,
    EXPIRY_DATE_REGEX: /^(0[1-9]|1[0-2])\/[0-9]{2}$/,
  },
  SIZES: {
    XS: "xs",
    SM: "sm",
    MD: "md",
    LG: "lg",
    XL: "xl",
  },
  VARIANTS: {
    PRIMARY: "primary",
    SECONDARY: "secondary",
    SUCCESS: "success",
    WARNING: "warning",
    ERROR: "error",
    INFO: "info",
    DANGER: "danger",
    OUTLINE: "outline",
    GHOST: "ghost",
  },
};

// Shopping Constants
export const SHOPPING = {
  FREE_SHIPPING_THRESHOLD: 100,
  TAX_RATE: 0.07, // 7%
  DEFAULT_SHIPPING_COST: 10,
  MAX_QUANTITY: 10,
  ORDER_STATUS: {
    PENDING: "pending",
    PROCESSING: "processing",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
  },
  PAYMENT_STATUS: {
    PENDING: "pending",
    PAID: "paid",
    FAILED: "failed",
    REFUNDED: "refunded",
  },
};

// Checkout Constants
export const CHECKOUT = {
  STEPS: {
    SHIPPING: "shipping",
    PAYMENT: "payment",
    CONFIRMATION: "confirmation",
  },
};

// Common Options
export const OPTIONS = {
  COUNTRIES: [
    { value: "United States", label: "United States" },
    { value: "Canada", label: "Canada" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "Australia", label: "Australia" },
    { value: "Germany", label: "Germany" },
    { value: "France", label: "France" },
    { value: "Japan", label: "Japan" },
    { value: "China", label: "China" },
  ],
  PAYMENT_METHODS: [
    { value: "credit_card", label: "Credit Card" },
    { value: "paypal", label: "PayPal" },
    { value: "apple_pay", label: "Apple Pay" },
  ],
};

// Theme/Colors
export const THEME = {
  COLORS: {
    PRIMARY: "primary",
    SECONDARY: "secondary",
    SUCCESS: "green",
    WARNING: "yellow",
    ERROR: "red",
    INFO: "blue",
    WHITE: "white",
    GRAY: "gray",
  },
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_SIBLING_COUNT: 1,
};
