import { producer } from '../config/kafka.js'
import { logger } from '../config/winston-logger.js'
import { KafkaDeliveryError } from '../util/Errors/KafkaDeliveryError.js'

/**
 * Sends a message to the Kafka message broker.
 *
 * @param {string} topic - The channel to send the message in.
 * @param {object} message - The data to send.
 */
export async function sendMessage (topic, message) {
  // TODO implement retries
  try {
    await producer.send({
      topic,
      messages: [{ value: message }]
    })
  } catch (e) {
    logger.info('Failed to send Kafka message: ', e)
    throw new KafkaDeliveryError()
  }
}
