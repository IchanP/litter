import { jest } from '@jest/globals'
import { UserService } from '../src/service/UserService.js'
import { KafkaDeliveryError } from '../src/util/Errors/KafkaDeliveryError.js'
import { BadDataError } from '../src/util/Errors/BadDataError.js'

describe('UserRegistration', () => {
  let userRegistration
  let mockUserRepo
  let mockBroker
  beforeEach(() => {
    mockBroker = {
      sendMessage: jest.fn()
    }
    // Mock dependencies
    mockUserRepo = {
      createDocument: jest.fn(),
      getOneMatching: jest.fn(),
      deleteOneRecord: jest.fn()
    }
    userRegistration = new UserService(mockUserRepo, mockBroker)
  })

  it('should successfully register a user', async () => {
    const testData = {
      email: 'test@example.com',
      username: 'testuser',
      userId: '123'
    }

    const expectedCreatedData = { ...testData, createdAt: '2025-01-06T23:57:29.846Z' }

    mockUserRepo.createDocument.mockResolvedValue(undefined)
    mockUserRepo.getOneMatching.mockResolvedValue(expectedCreatedData)
    mockBroker.sendMessage.mockResolvedValue(undefined)

    const result = await userRegistration.registerUser(testData)

    // Verify all the steps happened in order
    expect(mockUserRepo.createDocument).toHaveBeenCalledWith(testData)
    expect(mockUserRepo.getOneMatching).toHaveBeenCalledWith({ userId: testData.userId })
    expect(mockBroker.sendMessage).toHaveBeenCalledWith(
      process.env.USER_REGISTER_TOPIC,
      JSON.stringify(expectedCreatedData)
    )
    expect(result).toEqual(expectedCreatedData)
  })

  it('should cleanup and throw error if Kafka fails', async () => {
    const testData = {
      email: 'test@example.com',
      username: 'testuser',
      userId: '123'
    }
    const expectedCreatedData = { ...testData, createdAt: '2025-01-06T23:57:29.846Z' }

    const kafkaError = new KafkaDeliveryError('Failed to deliver')

    mockUserRepo.createDocument.mockResolvedValue(undefined)
    mockUserRepo.getOneMatching.mockResolvedValue(expectedCreatedData)
    mockBroker.sendMessage.mockRejectedValue(kafkaError)
    mockUserRepo.deleteOneRecord.mockResolvedValue(undefined)

    await expect(userRegistration.registerUser(testData)).rejects.toThrow(KafkaDeliveryError)

    // Verify cleanup was attempted
    expect(mockUserRepo.deleteOneRecord).toHaveBeenCalledWith({ userId: testData.userId })
  })

  it('should throw validation error for invalid data', async () => {
    const invalidData = {
      email: 'not-an-email',
      username: '',
      userId: '123'
    }

    await expect(userRegistration.registerUser(invalidData)).rejects.toThrow(BadDataError)

    // Verify no repository calls were made
    expect(mockUserRepo.createDocument).not.toHaveBeenCalled()
    expect(mockBroker.sendMessage).not.toHaveBeenCalled()
  })

  it('should throw through non-Kafka errors without cleanup', async () => {
    const testData = {
      email: 'test@example.com',
      username: 'testuser',
      userId: '123'
    }

    const dbError = new Error('Database connection failed')
    mockUserRepo.createDocument.mockRejectedValue(dbError)

    await expect(userRegistration.registerUser(testData)).rejects.toThrow(dbError)

    // Verify no cleanup was attempted
    expect(mockUserRepo.deleteOneRecord).not.toHaveBeenCalled()
  })
})
