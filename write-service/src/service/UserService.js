import { validateNotUndefined } from '../util/validate'

/**
 * Manages interactions between repositories concerning Users.
 */
export class UserService {
  /**
   * Handles the registration of a user by contacting relevant repositories and sending out kafka messages to other services.
   *
   * @param {object} registrationData - Object containing the user data.
   */
  async registerUser (registrationData) {
    validateNotUndefined(registrationData.email)
    validateNotUndefined(registrationData.username)
  }
}
