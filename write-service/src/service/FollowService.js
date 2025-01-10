import { UserRepository } from '../repositories/UserRepository.js'
import { FollowRepository } from '../repositories/FollowRepository.js'
import { logger } from '../config/winston-logger.js'
import { validateNotUndefined } from '../util/validate.js'
import { BadDataError } from '../util/Errors/BadDataError.js'
import { convertMongoCreateAtToISOdate } from '../util/index.js'
import { MessageBroker } from './MessageBroker.js'
import { DuplicateError } from '../util/Errors/DuplicateError.js'
import { NotFoundError } from '../util/Errors/NotFoundError.js'
import { KafkaDeliveryError } from '../util/Errors/KafkaDeliveryError.js'

/**
 * Service responsible for sending out messages to the broker and verifying the correctness of the passed data.
 */
export class FollowService {
  /**
   * Constructs a FollowService obejct.
   *
   * @param {FollowRepository} followRepo - The repo responsible for managing the follower relationships.
   * @param {UserRepository} userRepo - The repo responsible for managing Users.
   * @param {MessageBroker} broker - The message broker that will send async messages to other services.
   */
  constructor (followRepo, userRepo, broker) {
    this.followRepo = followRepo
    this.userRepo = userRepo
    this.broker = broker
  }

  /**
   * Orchestrates the following of a user and sending out the message to the message broker.
   *
   * @param {number} followed - The ID of the user to be followed.
   * @param {number} follower - The ID of the user that requested the follow.
   * @returns {object} - Returns an object with the fields followerId, followedId and createdAt.
   */
  async createFollow (followed, follower) {
    try {
      this.#performFollowValidation(followed, follower)
      const followedUser = await this.userRepo.getOneMatching({ userId: Number(followed) })
      const followerUser = await this.userRepo.getOneMatching({ userId: Number(follower) })
      if (!followedUser) throw new NotFoundError(`The user with id ${followed} does not exist.`)
      if (!followerUser) throw new NotFoundError(`The user with id ${follower} does not exist.`)

      const relationship = await this.followRepo.createDocument(followed, follower)
      relationship.createdAt = convertMongoCreateAtToISOdate(relationship.createdAt)
      await this.broker.sendMessage(process.env.FOLLOWED_TOPIC, JSON.stringify(relationship))
      return relationship
    } catch (e) {
      if (e instanceof DuplicateError === false) {
        try {
          await this.followRepo.deleteOneRecord({ followerId: follower, followedId: followed })
          logger.info('Succcesfully cleaned up Followed relationship..')
        } catch (error) {
          logger.error('Failed to cleanup Followed relationship...')
          throw e
        }
      }
      logger.error('Something went wrong during the follow request.')
      throw e
    }
  }

  /**
   * Orchestrates the deletion of a follow relationship and sends out event to message broker.
   *
   * @param {number} followed - The ID of the user to be unfollowed.
   * @param {number} follower - The ID of the user that requested the unfollow.
   */
  async deleteFollow (followed, follower) {
    try {
      this.#performFollowValidation(follower, followed)
      const relationship = await this.followRepo.getOneMatching(Number(followed), Number(follower))
      if (!relationship) {
        throw new NotFoundError('This relationship does not exist.')
      }
      await this.broker.sendMessage(process.env.UNFOLLOW_TOPIC, JSON.stringify(relationship))
      await this.followRepo.deleteOneRecord({ folowerId: follower, followedId: followed })
    } catch (e) {
      if (e instanceof KafkaDeliveryError) {
        logger.error('Failed to send delete notification to other services...')
        throw e
      }
      logger.error(e.message)
      logger.error(`Error on deleting Follower Relationship for followed User ${followed} and follower ${follower}`)
      throw e
    }
  }

  /**
   * Performs validation on the expected Follow fields.
   *
   * @param {string} followed - The user to be followed.
   * @param {string} follower - The user requesting the follow.
   */
  #performFollowValidation (followed, follower) {
    validateNotUndefined(follower, 'followerId')
    validateNotUndefined(followed, ':id')
    if (isNaN(Number(followed))) {
      throw new BadDataError('followerId must be a number.')
    }
    if (isNaN(Number(follower))) {
      throw new BadDataError(':id must be a number.')
    }
  }
}
