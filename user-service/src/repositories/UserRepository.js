import { UserModel } from '../model/userSchema.js'

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

  /**
   * Registers a user by writing it to the userModel.
   *
   * @param {object} user - A user object containing the fields userId, email and username.
   * @returns {object} - Returns the new user.
   */
  async registerUser (user) {
    const newUser = new UserModel({
      userId: user.userId,
      username: user.username,
      email: user.email,
      followers: [],
      following: []
    })
    await newUser.save()
    return newUser
  }
}
