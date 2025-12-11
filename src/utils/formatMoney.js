/**
 * Format a number as money with 2 decimal places
 * @param {number|string} amount - The amount to format
 * @returns {string} Formatted money string with 2 decimal places
 */
export const formatMoney = (amount) => {
  // Convert to number if it's a string
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Handle NaN or undefined values
  if (isNaN(num) || num === undefined || num === null) {
    return '0.00';
  }
  
  // Format to 2 decimal places
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export default formatMoney;