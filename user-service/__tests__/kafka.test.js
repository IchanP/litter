import { jest } from '@jest/globals'

const mockConsumer = {
  connect: jest.fn().mockResolvedValue(),
  disconnect: jest.fn().mockResolvedValue(),
  subscribe: jest.fn().mockResolvedValue(),
  run: jest.fn().mockResolvedValue()
}

jest.unstable_mockModule('kafkajs', () => ({
  default: {
    Kafka: jest.fn(() => ({
      consumer: jest.fn(() => mockConsumer)
    }))
  }
}))

describe('Kafka Consumer', () => {
  let connectBroker
  let subscribeToTopics
  let Kafka
  let PostService

  beforeAll(async () => {
    const kafkaImport = await import('../src/config/kafka.js')
    const { default: kafkajs } = await import('kafkajs') // Strangely this is needed here but not in write-service??
    connectBroker = kafkaImport.connectBroker
    subscribeToTopics = kafkaImport.subscribeToTopics
    Kafka = kafkajs.Kafka
  })

  beforeEach(() => {
    PostService = {
      handleMessage: jest.fn().mockResolvedValue()
    }
  })

  // Test happy path of connecting to kafka
  it('should successfully connect to Kafka broker and return consumer', async () => {
    const connectionString = 'localhost:9092'
    const clientId = 'test-client'
    const groupId = 'test-group'

    const consumer = await connectBroker(connectionString, clientId, groupId)

    expect(Kafka).toHaveBeenCalledWith({
      clientId,
      brokers: [connectionString]
    })
    expect(mockConsumer.connect).toHaveBeenCalled()
    expect(consumer).toBeDefined()
    expect(consumer).toBe(mockConsumer)
  })

  // Happy path of subscribing
  it('should successfully subscribe to topics and handle messages', async () => {
    const topics = ['test-topic-1', 'test-topic-2']
    const consumer = mockConsumer

    await subscribeToTopics(consumer, topics, PostService)

    expect(consumer.subscribe).toHaveBeenCalledWith({
      topics,
      fromBeginning: true
    })
    expect(consumer.run).toHaveBeenCalled()

    // Test message handling by simulating a message
    const messageHandler = consumer.run.mock.calls[0][0].eachMessage
    const testMessage = {
      topic: 'test-topic-1',
      partition: 0,
      message: { value: 'test message' }
    }

    await messageHandler(testMessage)

    expect(PostService.handleMessage).toHaveBeenCalledWith({
      topic: testMessage.topic,
      message: testMessage.message
    })
  })
})
