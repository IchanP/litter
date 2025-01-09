import { UserRepository } from '../repositories/UserRepository.js'
import { FollowRepository } from '../repositories/FollowRepository.js'

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
}
