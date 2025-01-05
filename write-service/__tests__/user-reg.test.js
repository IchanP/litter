import { jest } from '@jest/globals'
import { UserService } from '../src/service/UserService.js'

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

    const expectedCreatedData = { ...testData, _id: 'someId' }

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
})
