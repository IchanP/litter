/**
 * Extends the error class for error code responses.
 */
export class TooMuchDataError extends Error {
  /**
   * Constructs an error with default "Could not connect to Kafka broker" error message.
   *
   * @param {string} message - Optional paramater that overrides the default message.
   */
  constructor (message) {
    super(message || 'The provided data was too large for the server to handle.')
  }
}
