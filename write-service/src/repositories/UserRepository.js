import { UserModel } from '../model/UserSchema.js'
import { DuplicateError } from '../../Utils/Errors/DuplicateError.ts'
import { Error } from 'mongoose'

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
   */
  async createDocument (userData) {

  }
}
