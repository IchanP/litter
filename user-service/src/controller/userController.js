import { UserService } from '../service/UserService.js'

/**
 * Controller for handling user-related API requests.
 */
export class UserController {
  /**
   * Constructs a finderuser object.
   *
   * @param {UserService} userService - The service.
   */
  constructor (userService) {
    this.userService = userService
  }

  /**
   * Fetch a user's profile by ID.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getUser (req, res, next) {
    try {
      const userId = req.params.id
      const user = await this.userService.getUser(userId)
      res.status(200).json({
        success: true,
        data: user
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Returns a list of the followed users.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getFollowing (req, res, next) {
    try {
      const userId = req.params.id
      console.log(userId)
      const following = await this.userService.getFollowing(userId)
      res.status(200).json({
        success: true,
        data: following
      })
    } catch (e) {
      next(e)
    }
  }

  /**
   * Search for users based on a query string.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async searchUsers (req, res, next) {
    try {
      const query = req.query.query
      const users = await this.userService.searchUsers(query)
      res.status(200).json({
        success: true,
        data: users
      })
    } catch (error) {
      next(error)
    }
  }
}
