import { jest } from '@jest/globals'
import { PostService } from '../src/service/PostService.js'
import { BadDataError } from '../src/util/Errors/BadDataError.js'
import { KafkaDeliveryError } from '../src/util/Errors/KafkaDeliveryError.js'

describe('PostService', () => {
  let postService
  let mockPostRepo
  let mockUserRepo
  let mockBroker

  beforeEach(() => {
    // Setup mocks
    mockPostRepo = {
      createDocument: jest.fn(),
      deleteOneRecord: jest.fn()
    }
    mockUserRepo = {
      getOneMatching: jest.fn()
    }
    mockBroker = {
      sendMessage: jest.fn()
    }

    postService = new PostService(mockPostRepo, mockUserRepo, mockBroker)
  })

  describe('createPost', () => {
    const validPostData = {
      authorId: 'user123',
      content: 'Test post content'
    }
    const mockUser = { userId: 'user123', name: 'Test User' }
    const mockCreatedPost = {
      postId: 'post123',
      authorId: 'user123',
      content: 'Test post content',
      createdAt: new Date()
    }

    it('should successfully create a post when all conditions are met', async () => {
      mockUserRepo.getOneMatching.mockResolvedValue(mockUser)
      mockPostRepo.createDocument.mockResolvedValue(mockCreatedPost)
      mockBroker.sendMessage.mockResolvedValue()

      const result = await postService.createPost(validPostData)

      expect(mockUserRepo.getOneMatching).toHaveBeenCalledWith({ userId: validPostData.authorId })
      expect(mockPostRepo.createDocument).toHaveBeenCalledWith(validPostData)
      expect(mockBroker.sendMessage).toHaveBeenCalledWith(
        process.env.NEW_POST_TOPIC,
        JSON.stringify(mockCreatedPost)
      )
      expect(result).toEqual(mockCreatedPost)
    })

    it('should throw BadDataError when user is not found', async () => {
      mockUserRepo.getOneMatching.mockResolvedValue(null)

      await expect(postService.createPost(validPostData))
        .rejects
        .toThrow(new BadDataError('No user with that id.'))
      expect(mockPostRepo.createDocument).not.toHaveBeenCalled()
      expect(mockBroker.sendMessage).not.toHaveBeenCalled()
    })

    it('should cleanup created post when broker fails', async () => {
      mockUserRepo.getOneMatching.mockResolvedValue(mockUser)
      mockPostRepo.createDocument.mockResolvedValue(mockCreatedPost)
      mockBroker.sendMessage.mockRejectedValue(new KafkaDeliveryError('Failed to deliver message'))
      mockPostRepo.deleteOneRecord.mockResolvedValue()

      await expect(postService.createPost(validPostData))
        .rejects
        .toThrow(KafkaDeliveryError)

      expect(mockPostRepo.deleteOneRecord).toHaveBeenCalledWith({
        postId: mockCreatedPost.postId
      })
    })

    it('should log error when cleanup fails after broker error', async () => {
      mockUserRepo.getOneMatching.mockResolvedValue(mockUser)
      mockPostRepo.createDocument.mockResolvedValue(mockCreatedPost)
      mockBroker.sendMessage.mockRejectedValue(new KafkaDeliveryError('Failed to deliver message'))
      mockPostRepo.deleteOneRecord.mockRejectedValue(new Error('Cleanup failed'))

      await expect(postService.createPost(validPostData))
        .rejects
        .toThrow(KafkaDeliveryError)

      expect(mockPostRepo.deleteOneRecord).toHaveBeenCalledWith({
        postId: mockCreatedPost.postId
      })
    })

    it('should throw and log error when validation fails', async () => {
      const invalidPostData = {
        // Missing required fields
      }

      await expect(postService.createPost(invalidPostData))
        .rejects
        .toThrow()

      expect(mockPostRepo.createDocument).not.toHaveBeenCalled()
      expect(mockBroker.sendMessage).not.toHaveBeenCalled()
    })
  })
})
