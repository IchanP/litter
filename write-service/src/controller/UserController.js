import { UserService } from '../service/UserService'

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
   */
  async register (req, res, next) {
    try {
      await this.userService.registerUser()
      req.body.status = 201
      next()
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
    // TODO - return different codes depending on the error
    next(err)
  }
}
