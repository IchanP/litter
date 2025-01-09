import { producer } from '../config/kafka.js'
import { logger } from '../config/winston-logger.js'
import { KafkaDeliveryError } from '../util/Errors/KafkaDeliveryError.js'

/**
 * A broker which handles the sending of messages across topics.
 */
export class MessageBroker {
/**
 * Sends a message to the Kafka message broker.
 *
 * @param {string} topic - The channel to send the message in.
 * @param {object} message - The data to send.
 */
  async sendMessage (topic, message) {
  // TODO implement retries
    try {
      await producer.send({
        topic,
        messages: [{ value: message }]
      })
      logger.info(`Successfully sent message in ${topic}`)
    } catch (e) {
      logger.info('Failed to send Kafka message: ', e)
      throw new KafkaDeliveryError()
    }
  }
}
