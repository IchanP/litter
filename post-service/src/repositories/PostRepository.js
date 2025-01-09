import { PostModel } from '../models/PostSchema.js'

/**
 * Repository for interacting with the Post collection in MongoDB.
 */
export class PostRepository {
  /**
   * Fetch a user by their unique ID.
   *
   * @param {string} userId - The user's unique ID.
   * @returns {Promise<object>} The user's posts.
   */
  async findPostsById (userId) {
    return PostModel.find({ userId }).sort({ createdAt: -1 })
  }

  /**
   * Fetch posts from followed users.
   *
   * @param {Array<string>} followedUserIds - List of user IDs that are followed.
   * @returns {Promise<Array>} A list of posts by the followed users.
   */
  async findFeedById (followedUserIds) {
    return PostModel.find({ userId: { $in: followedUserIds } }).sort({ createdAt: -1 })
  }
}
