import { UserModel } from '../model/UserSchema.js'
import { DuplicateError } from '../util/Errors/DuplicateError.js'
import { Error } from 'mongoose'
import { BadDataError } from '../util/Errors/BadDataError.js'

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
   * @param {object} userData - UserData that has an email, userId and username field.
   * @returns {object} - Returns an object with fields, userId, email and username
   */
  async createDocument (userData) {
    try {
      const user = new UserModel({
        userId: userData.userId,
        email: userData.email,
        username: userData.username
      })
      await user.save()
      return { userId: user.userId, email: user.email, username: user.username }
    } catch (e) {
      const error = e
      if (error.code === 11000) {
        const keyPattern = error.keyPattern
        const duplicateField = Object.keys(keyPattern)[0]
        throw new DuplicateError(`${duplicateField} already exists.`)
      } else if (error instanceof Error.ValidationError) {
        throw new BadDataError(error.message)
      }
      throw error
    }
  }

  /**
   * Finds a user based on the passed filter and deletes the entry.
   *
   * @param {object} filter - Should be an object type matching either:
   * {email: email}
   * {userId: userId}
   * {username: username}
   */
  async deleteOneRecord (filter) {
    const result = await UserModel.deleteOne(filter)
    if (result.deletedCount === 0) {
      throw new Error(`No user found to delete with filter: ${JSON.stringify(filter)}`)
    }
  }

  /**
   * Finds a user based on the passed filter.
   *
   * @param {object} filter - Should be an object type matching either:
   * {email: email}
   * {userId: userId}
   * {username: username}
   * userId queries are preferred.
   * @returns {object | undefined} - Returns a user matching the UserModel definition or undefined if no user exists.
   */
  async getOneMatching (filter) {
    const user = await UserModel.findOne(filter)
    return user?.toObject()
  }
}
