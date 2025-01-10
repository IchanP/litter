import KafkaJS from 'kafkajs'
import { logger } from './winston-logger.js'
import { PostService } from '../service/PostService.js'

const { Kafka } = KafkaJS

/**
 * General sleep function that waits the specified number of milliseconds.
 *
 * @param {number} ms - Nubmer of miliseconds to wait.
 * @returns {Promise} - Returns a promise that resolves after the speciified amount of miliseconds.
 */
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Connects to the Kafka consumer.
 *
 * @param {string} connectionString - The DNS of the Kafka service running.
 * @param {string} clientId - The ID of the client for logging purposes
 * @param {string} groupId - The groupId of the consumer.
 * @returns {KafkaJS.Consumer} - A Kafka consumer.
 */
export async function connectBroker (connectionString, clientId, groupId) {
  const brokers = connectionString.includes(',')
    ? connectionString.split(',')
    : [connectionString]

  const kafka = new Kafka({ clientId, brokers })
  const consumer = kafka.consumer({ groupId })

  while (true) {
    try {
      logger.info('Attempting to connect to Kafka service...')
      await consumer.connect()
      logger.info('Kafka successfully connected!')
      break
    } catch (error) {
      logger.warn(`Failed to connect to Kafka: ${error.message}`)
      logger.info('Retrying in 5 seconds...')
      await sleep(5000)
    }
  }

  process.on('SIGTERM', async () => {
    await consumer.disconnect()
    logger.info('Post Service disconnected from Kafka.')
    process.exit(0)
  })

  return consumer
}

/**
 * Subscribes to topics and assigns the messageHandler function as the callback for new messages.
 *
 * @param {KafkaJS.Consumer} consumer - A kafka consumer.
 * @param {string[]} topics - The list of topics that the consumer will be subscribed to.
 * @param {PostService} service - The service responsible for handling the message.
 */
export async function subscribeToTopics (consumer, topics, service) {
  try {
    await consumer.subscribe({
      topics,
      fromBeginning: true
    })

    await consumer.run({
      /**
       * Function to run on each received message.
       *
       * @param {object} root0 - Message object.
       * @param {string} root0.topic - Topic where the message came from.
       * @param {string} root0.partition - Partition of the message.
       * @param {object} root0.message - The contained message.
       */
      eachMessage: async ({ topic, partition, message }) => {
        try {
          logger.info(`Received message from topic: ${topic}, partition: ${partition}`)
          await service.handleMessage({
            topic, message
          })
        } catch (e) {
          logger.error(`Error processing message: ${e.message}`, {
            topic,
            partition,
            offset: message.offset
          })
        }
      }
    })
  } catch (e) {
    logger.error(`Error in consumer for message: ${e.message}`)
    throw e
  }
}
