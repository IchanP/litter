import { BadDataError } from '../util/Errors/BadDataError.js'
import { DuplicateError } from '../util/Errors/DuplicateError.js'
import { UserService } from '../service/UserService.js'
import createError from 'http-errors'

/**
 * Controller for managing the user relevant operations for MongoDB.
 */
export class UserController {
  /**
   * Sets up inversify plugin.
   *
   * @param {UserService}  userService - The service which orchestrates and communicates with MongoDB repositories.
   */
  constructor (userService) {
    this.userService = userService
  }

  /**
   * Handles the operations of creating a new user in the database.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - The next call function.
   * @returns {Response} - Returns an express response object with status 201 containign the created user data.
   */
  async register (req, res, next) {
    try {
      const body = req.body
      const userData = await this.userService.registerUser(body)

      req.body.status = 201
      req.body.responseData = userData
      req.body.message = 'User created successfully'
      return res.status(req.body.status).json({
        message: req.body.message,
        data: req.body.responseData
      })
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
    } else if (e instanceof DuplicateError) {
      err = createError(409, e.message)
    }
    next(err)
  }
}
