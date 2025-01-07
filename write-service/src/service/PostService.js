import { PostRepository } from '../repositories/PostRepository.js'

/**
 * Service for managing the creation, deletion and updates of Posts.
 */
export class PostService {
  /**
   * Constructs a PostService object.
   *
   * @param {PostRepository} postRepo - The repository responsible for managing Posts.
   */
  constructor (postRepo) {
    this.postRepo = postRepo
  }

  /**
   * Orchestrates the creation of a post object in mongodb and calls the message broker to alert other services of the creation.
   */
  async createPost () {

  }
}
