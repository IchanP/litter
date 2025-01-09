import { UserService } from '../../../user-service/src/service/UserService.js'
import { PostRepository } from '../repositories/PostRepository.js'

/**
 * Service for handling post-related business logic.
 */
export class PostService {
  /**
   * Constructs a PostService object.
   *
   * @param {PostRepository} postRepository - The post repository responsible for fetching post data from mongodb.
   * @param {UserService} userService - The user service responsible for fetching user data.
   */
  constructor (postRepository, userService) {
    this.postRepository = postRepository // Handles database interactions for posts
    this.userService = userService // Fetches user-related data from user-service
  }

  /**
   * Fetch all posts by a specific user.
   *
   * @param {string} userId - The user's unique ID.
   * @returns {Promise<Array>} A list of posts by the user.
   */
  async getUserPosts (userId) {
    if (!userId) {
      throw new Error('User ID is required')
    }
    return this.postRepository.findPostsById(userId)
  }

  /**
   * Fetch the feed for a user based on followed users.
   *
   * @param {string} userId - The user's unique ID.
   * @returns {Promise<Array>} A list of posts for the user's feed.
   */
  async getUserFeed (userId) {
    if (!userId) {
      throw new Error('User ID is required to fetch the feed')
    }

    // Fetch followed user IDs from the user-service
    const followedUserIds = await this.userService.getFollowedUserIds(userId)

    if (!followedUserIds || followedUserIds.length === 0) {
      return [] // Empty feed if the user follows no one
    }

    // Fetch posts for the feed
    return this.postRepository.findFeedById(followedUserIds)
  }
}
