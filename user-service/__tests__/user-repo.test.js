import { jest } from '@jest/globals'

const mockFindOne = jest.fn()
const mockFindByIdAndUpdate = jest.fn()

jest.unstable_mockModule('../src/model/userSchema.js', () => ({
  UserModel: {
    findOne: mockFindOne,
    findByIdAndUpdate: mockFindByIdAndUpdate
  }
}))

describe('UserRepository Relationships', () => {
  let UserRepository
  let userRepository

  beforeAll(async () => {
    const module = await import('../src/repositories/UserRepository.js')
    UserRepository = module.UserRepository
  })

  beforeEach(() => {
    jest.clearAllMocks()
    userRepository = new UserRepository()
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  describe('createFollowRelationship', () => {
    jest.setTimeout(10000)

    it('should create a follow relationship between two users', async () => {
      const followerUser = { _id: 'followerId123', userId: 'user1', following: [] }
      const followedUser = { _id: 'followedId456', userId: 'user2', followers: [] }

      mockFindOne
        .mockResolvedValueOnce(followerUser)
        .mockResolvedValueOnce(followedUser)

      mockFindByIdAndUpdate
        .mockResolvedValueOnce(followerUser)
        .mockResolvedValueOnce(followedUser)

      const result = await userRepository.createFollowRelationship('user1', 'user2')

      expect(mockFindOne).toHaveBeenCalledTimes(2)
      expect(mockFindOne).toHaveBeenNthCalledWith(1, { userId: 'user1' })
      expect(mockFindOne).toHaveBeenNthCalledWith(2, { profileId: 'user2' })

      expect(mockFindByIdAndUpdate).toHaveBeenCalledTimes(2)
      expect(mockFindByIdAndUpdate).toHaveBeenNthCalledWith(1,
        'followerId123',
        { $push: { following: 'user2' } }
      )
      expect(mockFindByIdAndUpdate).toHaveBeenNthCalledWith(2,
        'followedId456',
        { $push: { followers: 'user1' } }
      )

      expect(result).toEqual([followerUser, followedUser])
    })

    it('should throw error when follower user not found', async () => {
      mockFindOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ _id: 'followedId456', userId: 'user2' })

      await expect(async () => {
        await userRepository.createFollowRelationship('user1', 'user2')
      }).rejects.toThrow('Cannot find one or both users.')

      expect(mockFindByIdAndUpdate).not.toHaveBeenCalled()
    })

    it('should throw error when followed user not found', async () => {
      mockFindOne
        .mockResolvedValueOnce({ _id: 'followerId123', userId: 'user1' })
        .mockResolvedValueOnce(null)

      await expect(async () => {
        await userRepository.createFollowRelationship('user1', 'user2')
      }).rejects.toThrow('Cannot find one or both users.')

      expect(mockFindByIdAndUpdate).not.toHaveBeenCalled()
    })
  })

  describe('removeRelationship', () => {
    it('should remove a follow relationship between two users', async () => {
      const followerUser = { _id: 'followerId123', userId: 'user1', following: ['followedId456'] }
      const followedUser = { _id: 'followedId456', userId: 'user2', followers: ['followerId123'] }

      mockFindOne
        .mockResolvedValueOnce(followerUser)
        .mockResolvedValueOnce(followedUser)

      mockFindByIdAndUpdate
        .mockResolvedValueOnce(followerUser)
        .mockResolvedValueOnce(followedUser)

      const result = await userRepository.removeRelationship('user1', 'user2')

      expect(mockFindOne).toHaveBeenCalledTimes(2)
      expect(mockFindOne).toHaveBeenNthCalledWith(1, { userId: 'user1' })
      expect(mockFindOne).toHaveBeenNthCalledWith(2, { profileId: 'user2' })

      expect(mockFindByIdAndUpdate).toHaveBeenCalledTimes(2)
      expect(mockFindByIdAndUpdate).toHaveBeenNthCalledWith(1,
        'followerId123',
        { $pull: { following: 'user2' } }
      )
      expect(mockFindByIdAndUpdate).toHaveBeenNthCalledWith(2,
        'followedId456',
        { $pull: { followers: 'user1' } }
      )

      expect(result).toEqual([followerUser, followedUser])
    })

    it('should throw error when either user not found during removal', async () => {
      mockFindOne
        .mockResolvedValueOnce({ _id: 'followerId123', userId: 'user1' })
        .mockResolvedValueOnce(null)

      await expect(async () => {
        await userRepository.removeRelationship('user1', 'user2')
      }).rejects.toThrow('Cannot find one or both users.')

      expect(mockFindByIdAndUpdate).not.toHaveBeenCalled()
    })
  })
})
