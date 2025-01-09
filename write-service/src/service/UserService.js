import { logger } from '../config/winston-logger.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { convertMongoCreateAtToISOdate } from '../util/index.js'
import { validateNotUndefined } from '../util/validate.js'
import { MessageBroker } from './MessageBroker.js'

/**
 * Manages interactions between repositories concerning Users.
 */
export class UserService {
  /**
   * Constructs a UserService object.
   *
   * @param {UserRepository} userRepo - Class responsible for handling fetching and writing of data concerning users.
   * @param {MessageBroker} broker - The broker responsible for sending events across services.
   */
  constructor (userRepo, broker) {
    this.userRepo = userRepo
    this.broker = broker
  }

  /**
   * Handles the registration of a user by contacting relevant repositories and sending out kafka messages to other services.
   *
   * @param {object} registrationData - Object containing the user data.
   * @returns {object} - Returns an object containing the created data.
   */
  async registerUser (registrationData) {
    try {
      this.#performUserValidations(registrationData)

      await this.userRepo.createDocument(registrationData)
      const createdData = await this.userRepo.getOneMatching({ userId: registrationData?.userId })
      // Need to await this, else it will return a 201 even if Kafka fails to send
      createdData.createdAt = convertMongoCreateAtToISOdate(createdData.createdAt)
      await this.broker.sendMessage(process.env.USER_REGISTER_TOPIC, JSON.stringify(createdData))
      return createdData
    } catch (e) {
      try {
        logger.info('Succesfully cleaned up Kafka registration...')
        await this.userRepo.deleteOneRecord({ userId: registrationData?.userId })
      } catch (e) {
        logger.error('Failed to cleanup Kafka registration...')
      }
      throw e
    }
  }

  /**
   * Performs validation on expected User fields.
   *
   * @param {object} userData - Object that should contain the expected user fields.
   */
  #performUserValidations (userData) {
    validateNotUndefined(userData?.email, 'Email')
    validateNotUndefined(userData?.username, 'Username')
    validateNotUndefined(userData?.userId, 'userId')
  }
}
