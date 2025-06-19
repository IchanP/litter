/**
 * Converts a mongoose created at string to an ISO format datetime.
 *
 * @param {string} createdAt - The mongoose createdAt string.
 * @returns {string} - An ISO formated (YYYY/MM/DD) date string.
 */
export function convertMongoCreateAtToISOdate (createdAt) {
  return new Date(createdAt).toISOString().split('T')[0]
}
