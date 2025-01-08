import { Kafka } from 'kafkajs'
import { logger } from './winston-logger.js'

let producer

/**
 * General sleep function that waits the specified number of milliseconds.
 *
 * @param {number} ms - Nubmer of miliseconds to wait.
 * @returns {Promise} - Returns a promise that resolves after the speciified amount of miliseconds.
 */
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Connects to the Kafka producer.
 *
 * @param {string} connectionString - The DNS of the Kafka service running.
 */
export async function connectBroker (connectionString) {
    const brokers = connectionString.includes(',')
        ? connectionString.split(',')
        : [connectionString]

    const kafka = new Kafka({ clientId: 'write-service', brokers })
    producer = kafka.producer()

    while (true) {
        try {
        logger.info('Attempting to connect to Kafka service...')
        await producer.connect()
        logger.info('Kafka successfully connected!')
        break
        } catch (error) {
        logger.warn(`Failed to connect to Kafka: ${error.message}`)
        logger.info('Retrying in 5 seconds...')
        await sleep(5000)
        }
    }

    process.on('SIGTERM', async () => {
        await producer.disconnect()
        logger.info('Write Service disconnected from Kafka.')
        process.exit(0)
    })
}

export { producer }
