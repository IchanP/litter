import { jest } from '@jest/globals'
import { UserService } from '../src/service/UserService.js'

/**
 * Mocked class
 */
class UserRepository {
  /**
   * Function to mock.
   */
  async findUserById () {}
}

describe('UserService', () => {
  let userService
  let userRepository

  beforeEach(() => {
    userRepository = new UserRepository()
    userService = new UserService(userRepository)
  })

  describe('getUser', () => {
    it('should return user when found', async () => {
      const mockUser = { id: '123', name: 'Test User' }
      userRepository.findUserById = jest.fn().mockResolvedValue(mockUser)

      const result = await userService.getUser('123')

      expect(result).toBe(mockUser)
      expect(userRepository.findUserById).toHaveBeenCalledWith('123')
      expect(userRepository.findUserById).toHaveBeenCalledTimes(1)
    })

    it('should throw error when user not found', async () => {
      userRepository.findUserById = jest.fn().mockResolvedValue(null)

      await expect(userService.getUser('123')).rejects.toThrow('User not found')
      expect(userRepository.findUserById).toHaveBeenCalledWith('123')
      expect(userRepository.findUserById).toHaveBeenCalledTimes(1)
    })
  })
})
