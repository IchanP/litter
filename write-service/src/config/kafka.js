import { Kafka } from 'kafkajs'
import { logger } from './winston-logger.js'

let producer

/**
 * Connects to the Kafka producer.
 *
 * @param {string} connectionString - The DNS of the Kafka service running.
 */
export async function connectBroker (connectionString) {
  const kafka = new Kafka({ clientId: 'write-service', brokers: ['my-kafka-cluster-kafka-bootstrap:9092'] })
  producer = kafka.producer()

  logger.info('Connecting to Kafka service.')
  producer.connect() // Automatically handles reconnects

  producer.on('producer.connect', () => {
    logger.info('Write service connected to Kafka service')
  })

  process.on('SIGTERM', async () => {
    await producer.disconnect()
    logger.info('Write Service disconnected from Kafka.')
    process.exit(0)
  })
}

export { producer }
