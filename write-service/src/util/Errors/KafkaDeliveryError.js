/**
 * An error thrown when a message fails to send to kafka.
 */
export class KafkaDeliveryError extends Error {
  /**
   * Constructs an error with default "Could not connect to Kafka broker" error message.
   *
   * @param {string} message - Optional paramater that overrides the default message.
   */
  constructor (message) {
    super(message || 'Could not connect to Kafka broker.')
  }
}
