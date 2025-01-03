import { UserModel } from '../model/UserSchema.js'
import { DuplicateError } from '../../Utils/Errors/DuplicateError.js'
import { Error } from 'mongoose'
import { BadDataError } from '../Errors/BadDataError.js'

/**
 * Handles interactions with mongoose to write and find data pertaining to users.
 */
export class UserRepository {
  /**
   * Creates a User Repository that interacts with the UserModel.
   */
  constructor () {
    this.model = UserModel
  }

  /**
   * Creates a document with the passed userData.
   *
   * @param {object} userData - UserData that has an email and username field.
   * @returns {object} - Returns an object with fields, userId, email and username
   */
  async createDocument (userData) {
    try {
      const user = new UserModel({
        email: userData.email,
        username: userData.username
      })
      await user.save()
      return { userId: user.userId, email: user.email, username: user.username }
    } catch (e) {
      const error = e
      if (error.code === 11000) {
        throw new DuplicateError()
      } else if (error instanceof Error.ValidationError) {
        throw new BadDataError(error.message)
      }
      throw error
    }
  }
}
