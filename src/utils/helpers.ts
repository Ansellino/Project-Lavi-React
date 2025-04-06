/**
 * General helper functions for the application
 */

// --------------------------
// Local Storage Helpers
// --------------------------

/**
 * Get an item from local storage and parse it as JSON
 */
export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Save an item to local storage as JSON
 */
export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

/**
 * Remove an item from local storage
 */
export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

// --------------------------
// URL and Query Helpers
// --------------------------

/**
 * Get a parameter from the URL query string
 */
export const getQueryParam = (name: string): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
};

/**
 * Add or update a query parameter in the URL without navigation
 */
export const updateQueryParam = (name: string, value: string): void => {
  const url = new URL(window.location.href);
  url.searchParams.set(name, value);
  window.history.replaceState({}, "", url.toString());
};

/**
 * Create a URL with query parameters
 */
export const createUrlWithParams = (
  baseUrl: string,
  params: Record<string, string>
): string => {
  const url = new URL(baseUrl, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });
  return url.toString();
};

// --------------------------
// Array and Object Helpers
// --------------------------

/**
 * Group an array of objects by a key
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

/**
 * Deep clone an object or array
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Sort an array of objects by a key
 */
export const sortByKey = <T>(
  array: T[],
  key: keyof T,
  direction: "asc" | "desc" = "asc"
): T[] => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    return 0;
  });
};

/**
 * Remove duplicates from an array by a key
 */
export const uniqueByKey = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

// --------------------------
// Validation Helpers
// --------------------------

/**
 * Check if a value is empty (null, undefined, empty string, empty array, or empty object)
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

/**
 * Check if a string is a valid email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if a password meets minimum requirements
 * (at least 8 characters, including a number and a special character)
 */
export const isStrongPassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /\d/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  );
};

// --------------------------
// UI and DOM Helpers
// --------------------------

/**
 * Dynamically build class names, filtering out falsy values
 */
export const classNames = (
  ...classes: (string | boolean | undefined)[]
): string => {
  return classes.filter(Boolean).join(" ");
};

/**
 * Scroll to an element smoothly
 */
export const scrollToElement = (elementId: string, offset = 0): void => {
  const element = document.getElementById(elementId);
  if (element) {
    const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
};

/**
 * Focus on an element and optionally select all text
 */
export const focusAndSelect = (elementId: string, selectAll = false): void => {
  const element = document.getElementById(elementId) as HTMLInputElement;
  if (element) {
    element.focus();
    if (selectAll) {
      element.select();
    }
  }
};

// --------------------------
// Async Helpers
// --------------------------

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last invocation
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait = 300
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * Creates a throttled function that only invokes the provided function
 * at most once per every `wait` milliseconds
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait = 300
): ((...args: Parameters<T>) => void) => {
  let waiting = false;
  let lastArgs: Parameters<T> | null = null;

  return function (...args: Parameters<T>) {
    if (waiting) {
      lastArgs = args;
      return;
    }

    func(...args);
    waiting = true;

    setTimeout(() => {
      waiting = false;
      if (lastArgs) {
        func(...lastArgs);
        lastArgs = null;
      }
    }, wait);
  };
};

/**
 * Retry a promise-based function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 300
): Promise<T> => {
  let retries = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (retries >= maxRetries) {
        throw error;
      }
      const delayMs = baseDelayMs * Math.pow(2, retries);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      retries++;
    }
  }
};

// --------------------------
// Math and Calculation Helpers
// --------------------------

/**
 * Calculate discount percentage
 */
export const calculateDiscountPercentage = (
  originalPrice: number,
  salePrice: number
): number => {
  if (originalPrice <= 0) return 0;
  const discount = originalPrice - salePrice;
  return Math.round((discount / originalPrice) * 100);
};

/**
 * Calculate shipping cost based on order total and threshold
 */
export const calculateShipping = (
  total: number,
  threshold = 100,
  standardShipping = 10
): number => {
  return total >= threshold ? 0 : standardShipping;
};

/**
 * Calculate tax amount based on subtotal and tax rate
 */
export const calculateTax = (subtotal: number, taxRate = 0.07): number => {
  return subtotal * taxRate;
};

/**
 * Generate a random integer between min and max (inclusive)
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
