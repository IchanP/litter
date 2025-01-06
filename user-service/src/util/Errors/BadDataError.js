/**
 * Extends the error class for error code responses
 */
export class BadDataError extends Error {
    /**
     * Constructs an error with default "Invalid data provided" error.
     *
     * @param {string} message - Optional paramater that overrides the default message.
     */
    constructor (message) {
        super(message || 'Invalid data provided')
    }
}
