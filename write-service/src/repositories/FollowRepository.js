import { FollowModel } from '../model/FollowSchema.js'
import { DuplicateError } from '../util/Errors/DuplicateError.js'

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
   * @param {number} followed - The followed user.
   * @param {number} follower - The follower.
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
}
