import { PostService } from '../service/PostService.js'
/**
 * Controller for handling post-related API requests.
 */
export class PostController {
  /**
   * Constructs a PostControlelr object.
   *
   * @param {PostService} postService - The service that the controller will contact.
   */
  constructor (postService) {
    this.postService = postService
  }

  /**
   * Fetch all posts by a specific user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getUserPosts (req, res, next) {
    try {
      const userId = req.params.id
      const posts = await this.postService.getUserPosts(userId)
      res.status(200).json({
        success: true,
        data: posts
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Fetch the feed for a user based on followed users.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getUserFeed (req, res, next) {
    try {
      const { followed } = req.body
      const feed = await this.postService.getUserFeed(followed)
      res.status(200).json({
        success: true,
        data: feed
      })
    } catch (error) {
      next(error)
    }
  }
}
