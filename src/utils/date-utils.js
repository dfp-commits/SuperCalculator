/**
 * Date Utilities
 * Stateless helper functions for date operations
 * Reference: docs/03_folder_structure.md (src/utils - stateless helpers only)
 */

/**
 * Formats a timestamp to a readable date string
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted date string
 */
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

/**
 * Checks if a timestamp is within the retention period
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @param {number} retentionDays - Retention period in days
 * @returns {boolean} True if within retention period
 */
function isWithinRetention(timestamp, retentionDays) {
  const cutoffTime = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);
  return timestamp > cutoffTime;
}

module.exports = {
  formatTimestamp,
  isWithinRetention
};
