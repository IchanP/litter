import { PostModel } from '../model/PostSchema.js'

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
   * Fetches the posts from the users and then sorts them by decreasing time.
   *
   * @param {Array<number>} follows - The IDS of the people to get the posts from.
   * @returns {Array<object>} - Returns an array of found posts.
   */
  async findFeedByIds (follows) {
    try {
      // Initialize posts as empty array
      const posts = []

      for (const user of follows) {
        const foundPosts = await PostModel.find({ userId: user })
        // Use spread operator to add individual posts rather than nested arrays
        posts.push(...foundPosts)
      }
      posts.sort((a, b) => b.createdAt - a.createdAt)
      return posts
    } catch (error) {
      console.error('Error in findFeedByIds:', error)
      throw error
    }
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

  /**
   * Creates a post object with the provided data.
   *
   * @param {object} postData - A post object containing the fields: AuthorId, content, postId and createdAt.
   * @returns {Promise<Document>} Returns a Post document.
   */
  async createPost (postData) {
    const post = new PostModel({
      userId: postData.authorId,
      content: postData.content,
      profileId: postData.profileId,
      postId: postData.postId,
      username: postData.username
    })
    await post.save()
    return post
  }

  /**
   * Attempts to delete a post matching the ID.
   *
   * @param {number} id - The id of the post to delete.
   */
  async deletePost (id) {
    const result = await PostModel.deleteOne({ postId: id })
    if (result.deletedCount === 0) {
      throw new Error(`No post found to delete with postId ${id}`)
    }
  }
}
