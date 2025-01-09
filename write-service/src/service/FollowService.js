import { UserRepository } from '../repositories/UserRepository.js'
import { FollowRepository } from '../repositories/FollowRepository.js'
import { logger } from '../config/winston-logger.js'
import { validateNotUndefined } from '../util/validate.js'
import { BadDataError } from '../util/Errors/BadDataError.js'

/**
 * Service responsible for sending out messages to the broker and verifying the correctness of the passed data.
 */
export class FollowService {
  /**
   * Constructs a FollowService obejct.
   *
   * @param {FollowRepository} followRepo - The repo responsible for managing the follower relationships.
   * @param {UserRepository} userRepo - The repo responsible for managing Users.
   */
  constructor (followRepo, userRepo) {
    this.followRepo = followRepo
    this.userRepo = userRepo
  }

  /**
   * Orchestrates the following of a user and sending out the message to the message broker.
   *
   * @param {number} followed - The ID of the user to be followed.
   * @param {number} follower - The ID of the user that requested the follow.
   */
  async createFollow (followed, follower) {
    try {
      this.#performFollowValidation(followed, follower)
    } catch (e) {
      logger.error('Something went wrong during the follow request.')
    }
  }

  /**
   * Performs validation on the expected Follow fields.
   *
   * @param {string} followed - The user requesting the follow.
   * @param {string} follower - The user to be followed.
   */
  #performFollowValidation (follower, followed) {
    validateNotUndefined(followed, 'followerId')
    validateNotUndefined(follower, ':id')
    if (isNaN(Number(followed))) {
      throw new BadDataError('followerId must be a number.')
    }
    if (isNaN(Number(follower))) {
      throw new BadDataError(':id must be a number.')
    }
  }
}
