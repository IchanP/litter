import { PostService } from '../service/PostService.js'
import createError from 'http-errors'
import { TooMuchDataError } from '../util/Errors/TooMuchDataError.js'
import { BadDataError } from '../util/Errors/BadDataError.js'
import { KafkaDeliveryError } from '../util/Errors/KafkaDeliveryError.js'
import { NotFoundError } from '../util/Errors/NotFoundError.js'

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
      const postData = await this.service.createPost(body)
      req.body.status = 201
      req.body.message = 'Post created successfully'
      req.body.responseData = { id: postData.postId, authorId: postData.authorId, content: postData.content, createdAt: postData.createdAt }
      return res.status(req.body.status).json({
        message: req.body.message,
        data: req.body.responseData
      })
    } catch (e) {
      this.#handleError(e, next)
    }
  }

  /**
   * Handles the operation of deleting a mpost in the database and managing the return error codes.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - The next call function.
   * @returns {Response} - Returns an express response object with status 201 containign the created user data.
   */
  async deletePost (req, res, next) {
    try {
      const id = req.params.id
      if (!id) {
        throw new NotFoundError('ID is missing')
      }
      await this.service.deletePost(Number(id))
      req.body.status = 203
      return res.status(req.body.status).send()
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
    let err = e
    if (e instanceof BadDataError) {
      err = createError(400, e.message)
    } else if (e instanceof NotFoundError) {
      err = createError(404, e.message)
    } else if (e instanceof TooMuchDataError) {
      err = createError(409, e.message)
    } else if (e instanceof KafkaDeliveryError) {
      err = createError(500)
    } else {
      err = createError(500)
    }
    next(err)
  }
}
