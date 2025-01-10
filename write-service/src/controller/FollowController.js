import createError from 'http-errors'
import { BadDataError } from '../util/Errors/BadDataError.js'
import { KafkaDeliveryError } from '../util/Errors/KafkaDeliveryError.js'
import { NotFoundError } from '../util/Errors/NotFoundError.js'
import { FollowService } from '../service/FollowService.js'
import { DuplicateError } from '../util/Errors/DuplicateError.js'

/**
 * Controller for managing the follow relevant operations for MongoDB.
 */
export class FollowController {
  /**
   * Constructs a FollowController object.
   *
   * @param {FollowService} service - The service responsible for managing follows
   */
  constructor (service) {
    this.service = service
  }

  /**
   * Handles the operaiton of creating a new follow relationship and managing the return error codes.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - The next call function.
   * @returns {Response} - Returns an express response object with status 201 containign the created user data.
   */
  async followUser (req, res, next) {
    try {
      const followerId = req.body?.followerId
      const followedId = req.params.id
      const followData = await this.service.createFollow(followedId, followerId)
      req.body.status = 201
      req.body.message = 'Follow relationship created successfully'
      delete followData.createdAt
      // TODO setup followerId and followedId return message
      return res.status(req.body.status).json({
        message: req.body.message,
        data: followData
      })
    } catch (e) {
      this.#handleError(e, next)
    }
  }

  /**
   * Handles the operation of removing a follow relationship and managing the return error codes.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - The next call function.
   * @returns {Response} - Returns an express response object with status 201 containign the created user data.
   */
  async unfollow (req, res, next) {
    try {
      const followerId = req.body?.followerId
      const followedId = req.params.id
      await this.service.deleteFollow(followedId, followerId)

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
    } else if (e instanceof KafkaDeliveryError) {
      err = createError(500)
    } else if (e instanceof DuplicateError) {
      err = createError(409, e.message)
    } else {
      err = createError(500)
    }
    next(err)
  }
}
