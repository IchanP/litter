import { PostService } from '../service/PostService.js'
/**
 * Controller for managing the post relevant operations for MongoDB.
 */
export class PostController {
  /**
   * Constructs a PostController object.
   *
   * @param {PostService} postService - The service which is responsible for creating a post.
   */
  constructor (postService) {
    this.service = postService
  }

  /**
   * Handles the operations of creating a new post in the database and managing the return error codes.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - The next call function.
   * @returns {Response} - Returns an express response object with status 201 containign the created user data.
   */
  async createPost (req, res, next) {

  }
}
