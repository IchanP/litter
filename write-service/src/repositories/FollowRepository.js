import { FollowModel } from '../model/FollowSchema.js'
import { DuplicateError } from '../util/Errors/DuplicateError.js'
import { logger } from '../config/winston-logger.js'
/**
 * Handles interactions with mongoose to write and find data pertaining to Follows.
 */
export class FollowRepository {
  /**
   * Constructs a FollowRepository object.
   */
  constructor () {
    this.model = FollowModel
  }

  /**
   * Creates a relationship of following between the passed ids.
   *
   * @param {string} followed - The followed user.
   * @param {string} follower - The follower.
   * @returns {object} - Returns an object with the fields followerId, followedId and createdAt.
   */
  async createDocument (followed, follower) {
    try {
      const relationship = new FollowModel({
        followerId: follower,
        followedId: followed
      })
      await relationship.save()
      return relationship.toObject()
    } catch (e) {
      if (e.code === 11000) {
        throw new DuplicateError('This relationship already exists.')
      }
    }
  }

  /**
   * Finds one follow document matching the specified relationship.
   *
   * @param {string} followed - The followed ID.
   * @param {string} follower - The follower ID.
   * @returns {object} - Returns an object with the fields followerId, followedId and createdAt.
   */
  async getOneMatching (followed, follower) {
    const relationshiop = await this.model.findOne({ followedId: followed, followerId: follower })
    return relationshiop?.toObject()
  }

  /**
   * Attempts to delete one record with the passed filter.
   *
   * @param {object} filter - The filter to use to search for the record to delete.
   */
  async deleteOneRecord (filter) {
    try {
      const result = await this.model.deleteOne(filter)
      if (result.deletedCount === 0) {
        throw new Error(`Failed to delete follow relationship with filter: ${filter}`)
      }
    } catch (e) {
      logger.info(e.message)
      throw e
    }
  }
}
