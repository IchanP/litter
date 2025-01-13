import { PostRepository } from '../repositories/PostRepository.js'
import { logger } from '../config/winston-logger.js'
/**
 * Service for handling post-related business logic.
 */
export class PostService {
  /**
   * Constructs a PostService object.
   *
   * @param {PostRepository} postRepository - The post repository responsible for fetching post data from mongodb.
   */
  constructor (postRepository) {
    this.postRepository = postRepository // Handles database interactions for posts
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
   * @param {Array<string>} followedUserIds - List of user IDs the user follows.
   * @returns {Promise<Array>} A list of posts for the user's feed.
   */
  async getUserFeed (followedUserIds) {
    if (!Array.isArray(followedUserIds) || followedUserIds.length === 0) {
      return [] // Return an empty feed if there are no followed users
    }
    const foundPosts = await this.postRepository.findFeedByIds(followedUserIds)
    const formattedPosts = []
    for (const post of foundPosts) {
      const fixedPost = { userId: post.userId, profileId: post.profileId, content: post.content, username: post.username, postId: post.postId, createdAt: new Date(post.createdAt).toLocaleString() }
      formattedPosts.push(fixedPost)
    }
    return formattedPosts
  }

  /**
   * Attempts to create a post with the provided data.
   *
   * @param {object} postData - A post object containing the fields: AuthorId, content, postId and createdAt.
   */
  async #createPost (postData) {
    try {
      const post = await this.postRepository.createPost(postData)
      if (!post) {
        throw new Error('Failed to create post.')
      }
      logger.info(`Successfully created post with id ${postData.postId}`)
    } catch (e) {
      logger.error(`Failed to create post with postId ${postData.postId}`)
      logger.error(e.message)
    }
  }

  /**
   * Attemps to delete a post by the provided ID.
   *
   * @param {object} postData - An object containing the field postId.
   */
  async #deletePost (postData) {
    try {
      await this.postRepository.deletePost(Number(postData?.postId))
      logger.info(`Successfully deleted post with id ${postData.postId}`)
    } catch (e) {
      logger.error(`Failed to delete post with postId ${postData.postId}`)
      logger.error(e.message)
    }
  }

  /**
   * Handles the messages received from the message broker and forwards them to the correct function.
   *
   * @param {object} data - Object containing the topic and message.
   */
  async handleMessage (data) {
    const messageString = data.message.value.toString()
    const message = JSON.parse(messageString)
    switch (data.topic) {
      case process.env.NEW_POST_TOPIC:
        logger.info(`Creating new post with id ${message.postId}`)
        this.#createPost(message)
        break
      case process.env.DELETE_POST_TOPIC:
        logger.info(`Deleting post with id ${message.postId}`)
        this.#deletePost(message)
        break
      default:
        logger.error(`The ${data.topic} is not one of the subscribed topics for user-service.`)
    }
  }
}
