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
   * @returns {object} - Returns an object containing the created data.
   */
  async registerUser (registrationData) {
    this.#performUserValidations(registrationData)
    const userData = { email: registrationData.email, username: registrationData.username, userId: registrationData.userId }

    await this.userRepo.createDocument(userData)
    const createdData = await this.userRepo.getOneMatching({ userId: userData.userId })
    console.log(createdData)
    return createdData
  }

  /**
   * Performs validation on expected User fields.
   *
   * @param {object} userData - Object containing the expected user fields.
   */
  #performUserValidations (userData) {
    validateNotUndefined(userData?.email, 'Email')
    validateNotUndefined(userData?.username, 'Username')
    validateNotUndefined(userData?.userId, 'userId')
  }
}
