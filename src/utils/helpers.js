// Helper functions for the ecommerce application

/**
 * Format number to VND currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Format date to readable format
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

/**
 * Truncate text to specific length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} discountPrice - Discount price
 * @returns {number} Discount percentage
 */
export const calculateDiscount = (originalPrice, discountPrice) => {
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};
