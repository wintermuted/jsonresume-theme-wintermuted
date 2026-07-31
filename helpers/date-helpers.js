/**
 * Format an ISO date string as "Mon YYYY".
 * @param {string} dateStr
 * @returns {string}
 */
export function formatMonthYear(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/**
 * Format an ISO date string as "YYYY".
 * @param {string} dateStr
 * @returns {string}
 */
export function formatYear(dateStr) {
  return new Date(dateStr + 'T00:00:00').getFullYear().toString();
}
