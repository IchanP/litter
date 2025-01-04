import { UserRepository } from '../repositories/UserRepository.js'
import { validateNotUndefined } from '../util/validate.js'

/**
 * Manages interactions between repositories concerning Users.
 */
export class UserService {
  /**
   * Constructs a UserService object.
   *
   * @param {UserRepository} userRepo - Class responsible for handling fetching and writing of data concerning users.
   */
  constructor (userRepo) {
    this.userRepo = userRepo
  }

  /**
   * Handles the registration of a user by contacting relevant repositories and sending out kafka messages to other services.
   *
   * @param {object} registrationData - Object containing the user data.
   */
  async registerUser (registrationData) {
    validateNotUndefined(registrationData.email, 'Email')
    validateNotUndefined(registrationData.username, 'Username')
    const email = registrationData.email
    const username = registrationData.username
    const userId = registrationData.userId
    const userData = { email, username, userId }
    await this.userRepo.createDocument(userData)
  }
}
