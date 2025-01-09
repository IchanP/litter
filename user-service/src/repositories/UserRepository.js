import { UserModel } from '../model/UserSchema.js'

/**
 * Repository for interacting with the User collection in MongoDB.
 */
export class UserRepository {
  /**
   * Fetch a user by their unique ID.
   *
   * @param {string} userId - The user's unique ID.
   * @returns {Promise<object>} The user document.
   */
  async findUserById (userId) {
    return UserModel.findOne({ userId })
  }

  /**
   * Search for users by a query string.
   *
   * @param {string} query - The search query.
   * @returns {Promise<Array>} A list of users matching the query.
   */
  async searchUsers (query) {
    return UserModel.find({ username: new RegExp(query, 'i') })
  }
}
