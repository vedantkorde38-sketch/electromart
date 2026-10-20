/**
 * Formats a number to Indian Rupees (INR) with the ₹ symbol and Indian numbering system (lakhs, crores).
 * E.g., 129999 -> ₹1,29,999
 * @param {number|string} amount
 * @param {boolean} showDecimals - Whether to show decimals, default false for clean round prices
 * @returns {string} Formatted Indian Rupee currency string
 */
export const formatINR = (amount, showDecimals = false) => {
  const num = Number(amount);
  if (isNaN(num)) return '₹0';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0
  }).format(num);
};

/**
 * Calculates discount amount and percentage between original and discounted price.
 */
export const calculateDiscount = (originalPrice, discountedPrice) => {
  const orig = Number(originalPrice);
  const disc = Number(discountedPrice);
  if (!orig || !disc || orig <= disc) return { percentage: 0, savedAmount: 0 };

  const savedAmount = orig - disc;
  const percentage = Math.round((savedAmount / orig) * 100);
  return { percentage, savedAmount };
};
