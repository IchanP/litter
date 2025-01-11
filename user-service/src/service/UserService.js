import { UserRepository } from '../repositories/UserRepository.js'
import { logger } from '../config/winston-logger.js'

/**
 * Service for handling user-related business logic.
 */
export class UserService {
  /**
   * Service which coordinates the fetching of data from the user repository.
   *
   * @param {UserRepository} userRepository - The repository to fetch data from.
   */
  constructor (userRepository) {
    this.userRepository = userRepository
  }

  /**
   * Fetch a user's profile by ID.
   *
   * @param {string} userId - The user's unique ID.
   * @returns {Promise<object>} The user's profile data.
   */
  async getUser (userId) {
    const user = await this.userRepository.findUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }

  /**
   * Search for users by a query string.
   *
   * @param {string} query - The search query.
   * @returns {Promise<Array>} List of matching users.
   */
  async searchUsers (query) {
    return this.userRepository.searchUsers(query)
  }

  /**
   * Registers a user with the passed credentials.
   *
   * @param {object} user - A user containing the fields userId, email, username and createdAt
   */
  async #registerUser (user) {
    try {
      await this.userRepository.registerUser(user)
    } catch (e) {
      logger.error(`Issue registering user ${user.username}.`)
      logger.error(`error: ${e.message}`)
    }
  }

  /**
   * Handles the messages received from the message broker and forwards them to the correct function.
   *
   * @param {object} data - Object containing the topic and message.
   */
  async handleMessage (data) {
    // TODO make a switch for topic and read data value from buffer.
    const messageString = data.message.value.toString()
    const message = JSON.parse(messageString)
    console.log(message)
    switch (data.topic) {
      case process.env.USER_REGISTER_TOPIC:
        logger.info(`Registering user ${message.username}`)
        await this.#registerUser(message)
        break
      case process.env.FOLLOWED_TOPIC:
        logger.info(`Establishing relationship between ${message.followedId} and ${message.followerId}`)
        break
      case process.env.UNFOLLOW_TOPIC:
        logger.info(`Removing relationship between ${message.followedId} and ${message.followerId}`)
        break
      default:
        logger.error(`The ${data.topic} is not one of the subscribed topics for user-service.`)
    }
  }
}
