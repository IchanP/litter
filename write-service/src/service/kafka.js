import { producer } from '../config/kafka.js'
import { logger } from '../config/winston-logger.js'

/**
 * Sends a message to the Kafka message broker.
 *
 * @param {string} topic - The channel to send the message in.
 * @param {object} message - The data to send.
 */
export async function sendMessage (topic, message) {
  try {
    await producer.send({
      topic,
      messages: [{ value: message }]
    })
    // TODO - need handling of error in controller
  } catch (e) {
    logger.info('Failed to send message: ', e)
    throw e
  }
}
