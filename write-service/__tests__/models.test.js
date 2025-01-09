import { jest } from '@jest/globals'
import { FollowRepository } from '../src/repositories/FollowRepository.js'

describe('FollowRepository', () => {
  let followRepository
  let mockModel

  beforeEach(() => {
    mockModel = {
      deleteOne: jest.fn()
    }

    followRepository = new FollowRepository()
    followRepository.model = mockModel
  })

  describe('deleteOneRecord', () => {
    const testFilter = { followerId: 1, followedId: 2 }

    it('should successfully delete a record when it exists', async () => {
      mockModel.deleteOne.mockResolvedValue({ deletedCount: 1 })

      await followRepository.deleteOneRecord(testFilter)

      expect(mockModel.deleteOne).toHaveBeenCalledWith(testFilter)
      expect(mockModel.deleteOne).toHaveBeenCalledTimes(1)
    })

    it('should throw an error when no record is deleted', async () => {
      mockModel.deleteOne.mockResolvedValue({ deletedCount: 0 })

      await expect(followRepository.deleteOneRecord(testFilter))
        .rejects
        .toThrow(`Failed to delete follow relationship with filter: ${testFilter}`)
    })

    it('should propagate and log database errors', async () => {
      const testError = new Error('Database connection failed')
      mockModel.deleteOne.mockRejectedValue(testError)

      await expect(followRepository.deleteOneRecord(testFilter))
        .rejects
        .toThrow(testError)
    })
  })
})
