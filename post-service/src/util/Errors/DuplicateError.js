/**
 * Extends the error class for error code responses
 */
export class DuplicateError extends Error {
  /**
   * Constructs an error with default "Duplicate data found, this data already exists." error message.
   *
   * @param {string} message - Optional paramater that overrides the default message.
   */
  constructor (message) {
    super(message || 'Duplicate data found, this data already exists.')
  }
}
