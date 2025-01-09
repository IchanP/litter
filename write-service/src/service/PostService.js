import { logger } from '../config/winston-logger.js'
import { PostRepository } from '../repositories/PostRepository.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { BadDataError } from '../util/Errors/BadDataError.js'
import { KafkaDeliveryError } from '../util/Errors/KafkaDeliveryError.js'
import { NotFoundError } from '../util/Errors/NotFoundError.js'
import { convertMongoCreateAtToISOdate } from '../util/index.js'
import { validateNotUndefined } from '../util/validate.js'
import { MessageBroker } from './MessageBroker.js'

/**
 * Service for managing the creation, deletion and updates of Posts.
 */
export class PostService {
  /**
   * Constructs a PostService object.
   *
   * @param {PostRepository} postRepo - The repository responsible for managing Posts.
   * @param {UserRepository} userRepo - The repository responsible for managing users.
   * @param {MessageBroker} broker - The broker responsible for sending events across services.
   */
  constructor (postRepo, userRepo, broker) {
    this.postRepo = postRepo
    this.userRepo = userRepo
    this.broker = broker
  }

  /**
   * Orchestrates the creation of a post object in mongodb and calls the message broker to alert other services of the creation.
   *
   * @param {object} postData - An object with the fields authorId and content.
   * @returns {object} - Returns an object containing the created post.
   */
  async createPost (postData) {
    let createdPost
    try {
      this.#performPostValidation(postData)
      const foundUser = await this.userRepo.getOneMatching({ userId: postData?.authorId })

      if (!foundUser) {
        throw new BadDataError('No user with that id.')
      }
      createdPost = await this.postRepo.createDocument(postData)
      createdPost.createdAt = convertMongoCreateAtToISOdate(createdPost.createdAt)
      // TODO might need to pass more data here depending on how we make the post models look.
      await this.broker.sendMessage(process.env.NEW_POST_TOPIC, JSON.stringify(createdPost))
      return createdPost
    } catch (e) {
      try {
        await this.postRepo.deleteOneRecord({ postId: createdPost?.postId })
        logger.info('Successfully cleaned up Post creation...')
      } catch (e) {
        logger.error('Failed to cleanup Post creation...')
      }
      logger.error(`Error on creating User Post: ${e.message}`)
      throw e
    }
  }

  /**
   * Deletes a post from the database and sends out Kafka messages to other services to delete it as well.
   *
   * @param {number} id - The id of the post to delete.
   */
  async deletePost (id) {
    try {
      const post = await this.postRepo.getOneMatching(id)
      if (!post) {
        throw new NotFoundError('No post with that id.')
      }
      await this.broker.sendMessage(process.env.DELETE_POST_TOPIC, JSON.stringify({ postId: id }))
      await this.postRepo.deleteOneRecord(id)
    } catch (e) {
      if (e instanceof KafkaDeliveryError && id) {
        logger.error('Failed to send delete notification to other services...')
        throw e
      }
      logger.error(e.message)
      logger.error(`Error on deleting User Post ${id}`)
      throw e
    }
  }

  /**
   * Performs validation on the expected Post fields.
   *
   * @param {object} postData - Object that should contain the expected Post fields
   */
  #performPostValidation (postData) {
    validateNotUndefined(postData?.authorId, 'authorId')
    validateNotUndefined(postData?.content, 'content')
  }
}
