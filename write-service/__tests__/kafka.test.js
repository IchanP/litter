import { jest } from '@jest/globals'

// Move your imports inside the describe block after mocking
const mockProducer = {
  connect: jest.fn().mockResolvedValue(),
  disconnect: jest.fn().mockResolvedValue()
}

// Mock Kafka before any imports
jest.unstable_mockModule('kafkajs', () => ({
  Kafka: jest.fn(() => ({
    producer: jest.fn(() => mockProducer)
  }))
}))

describe('Kafka Export', () => {
  let producer
  let connectBroker
  let Kafka
  let kafkaImport

  // Set up the imports in beforeAll
  beforeAll(async () => {
    kafkaImport = await import('../src/config/kafka')
    const kafkajs = await import('kafkajs')
    producer = kafkaImport.producer
    connectBroker = kafkaImport.connectBroker
    Kafka = kafkajs.Kafka
  })

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  it('Producer should be undefined before connectBroker is called', () => {
    expect(producer).toBeUndefined()
  })

  it('Producer should be an object after connectBroker is called', async () => {
    const connectionString = 'localhost:9092'
    await connectBroker(connectionString)

    expect(Kafka).toHaveBeenCalledWith({
      clientId: 'write-service',
      brokers: [connectionString]
    })
    producer = kafkaImport.producer
    expect(producer).toBeDefined()
    expect(mockProducer.connect).toHaveBeenCalled()
  })
})
