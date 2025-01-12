import { jest } from '@jest/globals'

const mockDeleteOne = jest.fn()
const mockLogger = {
  info: jest.fn(),
  error: jest.fn()
}

jest.unstable_mockModule('../src/config/winston-logger.js', () => ({
  logger: mockLogger
}))

jest.unstable_mockModule('../src/model/PostSchema.js', () => ({
  PostModel: {
    deleteOne: mockDeleteOne
  }
}))

describe('PostService Integration Tests', () => {
  let postService
  let postRepository
  let PostRepository
  let PostService

  beforeAll(async () => {
    const postRepoModule = await import('../src/repositories/PostRepository.js')
    const postServiceModule = await import('../src/service/PostService.js')
    PostRepository = postRepoModule.PostRepository
    PostService = postServiceModule.PostService
    process.env.DELETE_POST_TOPIC = 'delete-post'
  })

  beforeEach(() => {
    postRepository = new PostRepository()
    postService = new PostService(postRepository)
  })

  describe('Delete Post Flow', () => {
    it('should successfully delete a post when receiving a valid delete message', async () => {
      mockDeleteOne.mockResolvedValueOnce({ deletedCount: 1 })

      const deleteMessage = {
        topic: process.env.DELETE_POST_TOPIC,
        message: {
          value: JSON.stringify({
            postId: 123
          })
        }
      }

      // Create a promise that will resolve after all microtasks
      const messagePromise = postService.handleMessage(deleteMessage)

      // Wait for all promises to resolve
      await messagePromise
      await new Promise(resolve => setImmediate(resolve))

      expect(mockDeleteOne).toHaveBeenCalledWith({ postId: 123 })
      expect(mockDeleteOne).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1, 'Deleting post with id 123')
      expect(mockLogger.info).toHaveBeenNthCalledWith(2, 'Successfully deleted post with id 123')
      expect(mockLogger.error).not.toHaveBeenCalled()
    })

    it('should handle deletion failure when post does not exist', async () => {
      mockDeleteOne.mockResolvedValueOnce({ deletedCount: 0 })

      const deleteMessage = {
        topic: process.env.DELETE_POST_TOPIC,
        message: {
          value: JSON.stringify({
            postId: 456
          })
        }
      }

      const messagePromise = postService.handleMessage(deleteMessage)

      // Wait for all promises to resolve
      await messagePromise
      await new Promise(resolve => setImmediate(resolve))

      expect(mockDeleteOne).toHaveBeenCalledWith({ postId: 456 })
      expect(mockDeleteOne).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1, 'Deleting post with id 456')
      expect(mockLogger.error).toHaveBeenNthCalledWith(1, 'Failed to delete post with postId 456')
      expect(mockLogger.error).toHaveBeenNthCalledWith(2, 'No post found to delete with postId 456')
    })

    it('should handle database errors during deletion', async () => {
      const error = new Error('Database connection failed')
      mockDeleteOne.mockRejectedValueOnce(error)

      const deleteMessage = {
        topic: process.env.DELETE_POST_TOPIC,
        message: {
          value: JSON.stringify({
            postId: 789
          })
        }
      }

      const messagePromise = postService.handleMessage(deleteMessage)

      // Wait for all promises to resolve
      await messagePromise
      await new Promise(resolve => setImmediate(resolve))

      expect(mockDeleteOne).toHaveBeenCalledWith({ postId: 789 })
      expect(mockDeleteOne).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1, 'Deleting post with id 789')
      expect(mockLogger.error).toHaveBeenNthCalledWith(1, 'Failed to delete post with postId 789')
      expect(mockLogger.error).toHaveBeenNthCalledWith(2, 'Database connection failed')
    })
  })
})
