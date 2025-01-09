import createError from 'http-errors'
import { BadDataError } from '../util/Errors/BadDataError.js'
import { KafkaDeliveryError } from '../util/Errors/KafkaDeliveryError.js'
import { NotFoundError } from '../util/Errors/NotFoundError.js'

/**
 * Controller for managing the follow relevant operations for MongoDB.
 */
export class FollowController {
  /**
   * Handles the operaiton of creating a new follow relationship and managing the return error codes.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - The next call function.
   * @returns {Response} - Returns an express response object with status 201 containign the created user data.
   */
  followUser (req, res, next) {
    try {
      return undefined
    } catch (e) {
      this.#handleError(e, next)
      return undefined // ?
    }
  }

  // TODO - Make this better
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
    } else {
      err = createError(500)
    }
    next(err)
  }
}
