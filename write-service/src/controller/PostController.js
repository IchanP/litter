import { PostService } from '../service/PostService.js'
import createError from 'http-errors'

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
    try {
      const body = req.body
    } catch (e) {
      this.#handleError(e, next)
    }
  }

  /**
   * Returns correct error codes that may occur during the editing or creation of user records.
   *
   * @param {Error} e - The error that occured
   * @param {Function} next - The next middleware function.
   */
  #handleError (e, next) {
    const err = e
    // TODO - set this up for correct routes
    /* if (e instanceof BadDataError) {
      err = createError(400, e.message)
    } else if (e instanceof DuplicateError) {
      err = createError(409, e.message)
    } else if (e instanceof KafkaDeliveryError) {
      err = createError(500)
    } */
    next(err)
  }
}
