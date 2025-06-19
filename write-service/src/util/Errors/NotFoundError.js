/**
 * An error thrown when data was not found.
 */
export class NotFoundError extends Error {
  /**
   * Constructs an error with default "Resource not found." error message.
   *
   * @param {string} message - Optional paramater that overrides the default message.
   */
  constructor (message) {
    super(message || 'Resource not found.')
  }
}
